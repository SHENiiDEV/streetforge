<?php

namespace Tests\Feature;

use App\Mail\PaymentReceiptMail;
use App\Models\Transaction;
use App\Models\User;
use App\Services\InvoiceService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\FakesCorefy;
use Tests\TestCase;

class CorefyPaymentTest extends TestCase
{
    use FakesCorefy;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->configureCorefy();
        config(['store.enabled_currencies' => ['USD', 'EUR', 'GBP']]);
        Mail::fake();
        Storage::fake('public');
    }

    private function order(string $currency = 'USD', string $amount = '25.00'): Transaction
    {
        $user = User::factory()->create(['game_balance' => 500, 'name' => 'Alex', 'surname' => 'Driver']);

        return Transaction::create([
            'user_id' => $user->id, 'transaction_ref' => 'TOP-SECURE123',
            'gateway' => 'credit_card', 'fiat_amount' => $amount, 'currency' => $currency,
            'game_credits' => 2750, 'status' => 'pending', 'invoice_number' => 'INV-COREFY-123',
            'customer_snapshot' => ['email' => $user->email, 'name' => $user->full_name, 'country' => 'GB', 'locale' => 'nb'],
        ]);
    }

    private function start(Transaction $transaction): void
    {
        $this->actingAs($transaction->user)->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')
            ->assertRedirect('https://hpp.example.test/secure-checkout');
    }

    public static function currencies(): array
    {
        return [['USD', '25.00', 'payment_card_usd_hpp'], ['EUR', '23.00', 'payment_card_eur_hpp'], ['GBP', '19.75', 'payment_card_gbp_hpp']];
    }

    #[DataProvider('currencies')]
    public function test_live_hpp_uses_frozen_order_currency_and_does_not_credit_on_redirect(string $currency, string $amount, string $service): void
    {
        $transaction = $this->order($currency, $amount);
        $this->fakeCorefy($transaction);

        $this->withSession(['currency' => 'GBP']);
        $this->start($transaction);

        Http::assertSent(fn (ClientRequest $request): bool => $request->method() === 'POST'
            && $request->hasHeader('Authorization', 'Basic '.base64_encode('coma_test_account:private-test-key'))
            && $request['data']['attributes']['test_mode'] === false
            && $request['data']['attributes']['reference_id'] === 'TOP-SECURE123'
            && $request['data']['attributes']['currency'] === $currency
            && $request['data']['attributes']['amount'] === (float) $amount
            && $request['data']['attributes']['service'] === $service
            && $request['data']['attributes']['customer']['reference_id'] === 'user_'.$transaction->user_id
            && $request['data']['attributes']['customer']['email'] === $transaction->user->email
            && $request['data']['attributes']['callback_url'] === 'https://merchant.example.test/topup/webhook'
            && str_contains($request['data']['attributes']['return_urls']['success'], '/topup/checkout/TOP-SECURE123'));
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
        $this->assertSame('pending', $transaction->fresh()->status);
        $this->assertSame('cpi_TOP-SECURE123', $transaction->fresh()->provider_invoice_id);
        Mail::assertNothingQueued();
    }

    public function test_repeated_pay_click_reuses_the_existing_hpp_invoice(): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction);
        $this->start($transaction);

        $this->start($transaction);

        Http::assertSentCount(1);
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
    }

    public function test_inertia_pay_returns_an_external_location_response(): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction);

        $this->actingAs($transaction->user)->withHeader('X-Inertia', 'true')
            ->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')
            ->assertStatus(409)->assertHeader('X-Inertia-Location', 'https://hpp.example.test/secure-checkout');

        $this->assertSame('pending', $transaction->fresh()->status);
    }

    public function test_missing_credentials_never_fall_back_to_mock_payment(): void
    {
        $transaction = $this->order();
        config(['services.corefy.api_key' => null]);

        $this->actingAs($transaction->user)->from('/topup/checkout/'.$transaction->transaction_ref)
            ->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')
            ->assertRedirect('/topup/checkout/'.$transaction->transaction_ref)->assertSessionHas('error');

        Http::assertNothingSent();
        $this->assertNull($transaction->fresh()->payment_requested_at);
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
    }

    public static function creationFailures(): array
    {
        return [['http'], ['timeout'], ['unsafe-url'], ['missing-url']];
    }

    #[DataProvider('creationFailures')]
    public function test_uncertain_or_invalid_creation_never_charges_again_or_credits_locally(string $failure): void
    {
        $transaction = $this->order();
        $resource = $this->corefyResource($transaction);
        $resource['attributes']['flow_data']['action'] = $failure === 'unsafe-url' ? 'javascript:alert(1)' : null;
        Http::fake(['payments.example.test/*' => match ($failure) {
            'http' => Http::response(['error' => 'Unavailable'], 500),
            'timeout' => Http::failedConnection(),
            default => Http::response(['data' => $resource], 201),
        }]);

        $this->actingAs($transaction->user)->from('/topup')->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')->assertSessionHas('error');
        $this->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')->assertSessionHas('error');

        Http::assertSentCount(1);
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
        $this->assertSame('pending', $transaction->fresh()->status);
        Mail::assertNothingQueued();
    }

    public function test_other_users_and_guests_cannot_pay_or_view_an_order(): void
    {
        $transaction = $this->order();
        $this->get('/topup/checkout/'.$transaction->transaction_ref)->assertRedirect('/login');
        $this->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')->assertRedirect('/login');
        $other = User::factory()->create();

        $this->actingAs($other)->get('/topup/checkout/'.$transaction->transaction_ref)->assertForbidden();
        $this->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')->assertForbidden();

        Http::assertNothingSent();
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
    }

    public function test_return_query_and_unsigned_webhooks_cannot_confirm_payment(): void
    {
        $transaction = $this->order();
        $this->actingAs($transaction->user)->get('/topup/checkout/'.$transaction->transaction_ref.'?returned=1&status=processed')
            ->assertOk()->assertInertia(fn (Assert $page) => $page->where('transaction.status', 'pending'));
        $this->postJson('/topup/webhook', ['data' => $this->corefyResource($transaction)])->assertForbidden();
        $this->postJson('/topup/webhook', ['data' => $this->corefyResource($transaction)], ['X-Signature' => 'invalid'])->assertForbidden();

        Http::assertNothingSent();
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
        $this->get('/invoices/'.$transaction->invoice_number.'/download')->assertNotFound();
    }

    public function test_signed_callback_confirms_payment_once_and_generates_one_localized_receipt(): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction);
        $this->start($transaction);

        $this->confirmCorefy($transaction)->assertOk();
        $this->confirmCorefy($transaction)->assertOk();

        $this->assertSame('3250.00', $transaction->user->fresh()->game_balance);
        $this->assertSame('success', $transaction->fresh()->status);
        $this->assertNotNull($transaction->fresh()->completed_at);
        Storage::disk('public')->assertExists($transaction->fresh()->invoice_path);
        Mail::assertQueued(PaymentReceiptMail::class, fn (PaymentReceiptMail $mail): bool => $mail->locale === 'nb');
        Mail::assertQueuedCount(1);
    }

    public function test_callback_waits_for_the_private_api_instead_of_trusting_the_callback_status(): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction, ['status' => 'process_pending']);
        $this->start($transaction);

        $this->confirmCorefy($transaction)->assertOk();

        $this->assertSame('pending', $transaction->fresh()->status);
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
        Mail::assertNothingQueued();
    }

    public static function mismatchedInvoices(): array
    {
        return [
            'amount' => [['amount' => 0.01]],
            'captured amount' => [['processed_amount' => 1]],
            'missing captured amount' => [['processed_amount' => null]],
            'currency' => [['currency' => 'EUR']],
            'reference' => [['reference_id' => 'TOP-OTHER']],
            'test payment' => [['test_mode' => true]],
        ];
    }

    #[DataProvider('mismatchedInvoices')]
    public function test_mismatched_private_api_data_cannot_credit_balance(array $attributes): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction, $attributes);
        $this->start($transaction);

        $this->confirmCorefy($transaction)->assertServiceUnavailable();

        $this->assertSame('pending', $transaction->fresh()->status);
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
        Mail::assertNothingQueued();
    }

    public function test_api_failure_does_not_fall_back_to_callback_amount_or_status(): void
    {
        $transaction = $this->order();
        $transaction->update(['provider_invoice_id' => 'cpi_TOP-SECURE123', 'payment_requested_at' => now()]);
        Http::fake(['payments.example.test/*' => Http::response([], 503)]);

        $this->confirmCorefy($transaction)->assertServiceUnavailable();

        $this->assertSame('pending', $transaction->fresh()->status);
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
    }

    public function test_callback_for_another_invoice_is_rejected_before_api_lookup(): void
    {
        $transaction = $this->order();
        $transaction->update(['provider_invoice_id' => 'cpi_expected', 'payment_requested_at' => now()]);

        $this->confirmCorefy($transaction)->assertUnprocessable();

        Http::assertNothingSent();
        $this->assertSame('pending', $transaction->fresh()->status);
    }

    public function test_early_webhook_can_recover_invoice_after_a_creation_timeout(): void
    {
        $transaction = $this->order();
        $transaction->update(['payment_requested_at' => now()]);
        $this->fakeCorefy($transaction);

        $this->confirmCorefy($transaction)->assertOk();

        $this->assertSame('cpi_TOP-SECURE123', $transaction->fresh()->provider_invoice_id);
        $this->assertSame('3250.00', $transaction->user->fresh()->game_balance);
    }

    public static function failedStatuses(): array
    {
        return [['process_failed'], ['authorize_failed'], ['expired'], ['terminated']];
    }

    #[DataProvider('failedStatuses')]
    public function test_terminal_failure_or_expiry_never_adds_credits(string $status): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction, ['status' => $status]);
        $this->start($transaction);

        $this->confirmCorefy($transaction)->assertOk();

        $this->assertSame('failed', $transaction->fresh()->status);
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
        Mail::assertNothingQueued();
    }

    public function test_full_refund_reverses_granted_credits_once_even_if_already_spent(): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction);
        $this->start($transaction);
        $this->confirmCorefy($transaction)->assertOk();
        $transaction->user->update(['game_balance' => 100]);
        $this->fakeCorefy($transaction, ['status' => 'refunded']);

        $this->confirmCorefy($transaction)->assertOk();
        $this->confirmCorefy($transaction)->assertOk();

        $this->assertSame('refunded', $transaction->fresh()->status);
        $this->assertSame('-2650.00', $transaction->user->fresh()->game_balance);
        $this->assertNotNull($transaction->fresh()->credits_reversed_at);
        Mail::assertQueuedCount(1);
    }

    public function test_refund_received_before_a_success_callback_does_not_grant_or_remove_credits(): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction, ['status' => 'refunded']);
        $this->start($transaction);
        $this->confirmCorefy($transaction)->assertOk();
        $this->fakeCorefy($transaction);

        $this->confirmCorefy($transaction)->assertOk();

        $this->assertSame('refunded', $transaction->fresh()->status);
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
        Mail::assertNothingQueued();
    }

    public function test_sensitive_gateway_response_is_not_serialized_into_checkout(): void
    {
        $transaction = $this->order();
        $transaction->update(['payment_url' => 'https://hpp.example.test/session', 'gateway_response' => ['secret' => 'private']]);

        $this->actingAs($transaction->user)->get('/topup/checkout/'.$transaction->transaction_ref)
            ->assertInertia(fn (Assert $page) => $page->missing('transaction.gateway_response')->missing('transaction.payment_url'));
    }

    public function test_reconciliation_recovers_a_timed_out_creation_without_creating_another_invoice(): void
    {
        $transaction = $this->order();
        $transaction->update(['payment_requested_at' => now()]);
        $this->fakeCorefy($transaction);

        $this->artisan('payments:reconcile', ['reference' => $transaction->transaction_ref, '--invoice' => 'cpi_TOP-SECURE123'])
            ->expectsOutput('TOP-SECURE123: success')->assertExitCode(0);
        $this->artisan('payments:reconcile', ['reference' => $transaction->transaction_ref])->assertExitCode(0);

        $this->assertSame('3250.00', $transaction->user->fresh()->game_balance);
        Http::assertNotSent(fn (ClientRequest $request): bool => $request->method() === 'POST');
        Mail::assertQueuedCount(1);
    }

    public function test_callback_signature_covers_the_exact_body_and_rejects_a_different_algorithm(): void
    {
        $transaction = $this->order();
        $body = json_encode(['data' => $this->corefyResource($transaction)], JSON_THROW_ON_ERROR);
        $secret = config('services.corefy.webhook_secret');
        $signature = base64_encode(sha1($secret.$body.$secret, true));

        $this->call('POST', '/topup/webhook', [], [], [], [
            'CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json',
            'HTTP_X_SIGNATURE' => $signature,
        ], $body.' ')->assertForbidden();
        $this->call('POST', '/topup/webhook', [], [], [], [
            'CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json',
            'HTTP_X_SIGNATURE' => hash_hmac('sha256', $body, $secret),
        ], $body)->assertForbidden();

        Http::assertNothingSent();
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
    }

    public function test_provider_specific_hmac_is_supported_only_when_explicitly_configured(): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction);
        $this->start($transaction);
        config(['services.corefy.signature_algorithm' => 'hmac_sha256']);
        $body = json_encode(['data' => $this->corefyResource($transaction)], JSON_THROW_ON_ERROR);

        $this->call('POST', '/topup/webhook', [], [], [], [
            'CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json',
            'HTTP_X_SIGNATURE' => hash_hmac('sha256', $body, config('services.corefy.webhook_secret')),
        ], $body)->assertOk();

        $this->assertSame('3250.00', $transaction->user->fresh()->game_balance);
    }

    public static function billingCountries(): array
    {
        return [['Germany', 'DE'], ['Norway', 'NO'], ['Sweden', 'SE'], ['United Kingdom', 'GB'], ['Czech Republic', 'CZ']];
    }

    #[DataProvider('billingCountries')]
    public function test_registered_country_names_are_sent_as_iso_codes(string $country, string $code): void
    {
        $transaction = $this->order();
        $transaction->update(['customer_snapshot' => array_merge($transaction->customer_snapshot, ['country' => $country])]);
        $this->fakeCorefy($transaction);

        $this->start($transaction);

        Http::assertSent(fn (ClientRequest $request): bool => $request['data']['attributes']['customer']['address']['country'] === $code);
    }

    public function test_receipt_failure_can_be_retried_without_adding_credits_twice(): void
    {
        $transaction = $this->order();
        $this->fakeCorefy($transaction);
        $this->mock(InvoiceService::class)->shouldReceive('generate')->once()->andThrow(new \RuntimeException('PDF temporarily unavailable.'));
        $this->start($transaction);

        $this->confirmCorefy($transaction)->assertServiceUnavailable();

        $this->assertSame('success', $transaction->fresh()->status);
        $this->assertSame('3250.00', $transaction->user->fresh()->game_balance);
        $this->assertNull($transaction->fresh()->receipt_queued_at);
        Mail::assertNothingQueued();

        $this->app->instance(InvoiceService::class, new InvoiceService);
        $this->confirmCorefy($transaction)->assertOk();

        $this->assertSame('3250.00', $transaction->user->fresh()->game_balance);
        Storage::disk('public')->assertExists($transaction->fresh()->invoice_path);
        Mail::assertQueuedCount(1);
    }

    public static function disabledCurrencies(): array
    {
        return [['USD'], ['GBP']];
    }

    #[DataProvider('disabledCurrencies')]
    public function test_disabled_currency_order_cannot_open_a_new_or_existing_hpp_session(string $currency): void
    {
        $transaction = $this->order($currency);
        $transaction->update(['provider_invoice_id' => 'cpi_existing', 'payment_url' => 'https://hpp.example.test/old-session']);
        config(['store.enabled_currencies' => ['EUR']]);

        $this->actingAs($transaction->user)->from('/topup')->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')
            ->assertRedirect('/topup')->assertSessionHas('error');
        $this->get('/topup/checkout/'.$transaction->transaction_ref)->assertInertia(fn (Assert $page) => $page->where('paymentAvailable', false));

        Http::assertNothingSent();
        $this->assertSame($currency, $transaction->fresh()->currency);
        $this->assertSame('500.00', $transaction->user->fresh()->game_balance);
    }
}
