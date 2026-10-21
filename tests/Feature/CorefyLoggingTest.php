<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use App\Services\CorefyLogger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;
use Tests\FakesCorefy;
use Tests\TestCase;

class CorefyLoggingTest extends TestCase
{
    use FakesCorefy;
    use RefreshDatabase;

    private string $logPath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->configureCorefy();
        $this->logPath = storage_path('framework/testing/corefy-'.Str::uuid().'.log');
        config(['logging.channels.corefy' => [
            'driver' => 'single', 'path' => $this->logPath, 'level' => 'info', 'permission' => 0600,
        ]]);
        Log::forgetChannel('corefy');
    }

    protected function tearDown(): void
    {
        Log::forgetChannel('corefy');
        File::delete($this->logPath);
        parent::tearDown();
    }

    private function order(): Transaction
    {
        $user = User::factory()->create(['name' => 'PrivateFirstName', 'surname' => 'PrivateSurname', 'email' => 'private-customer@example.test']);

        return Transaction::create([
            'user_id' => $user->id, 'transaction_ref' => 'TOP-LOGGING123', 'gateway' => 'credit_card',
            'fiat_amount' => '5.15', 'currency' => 'EUR', 'game_credits' => 560,
            'status' => 'pending', 'invoice_number' => 'INV-LOGGING123',
            'customer_snapshot' => [
                'name' => $user->full_name, 'first_name' => $user->name, 'surname' => $user->surname,
                'email' => $user->email, 'phone' => '+37120000123',
                'street' => 'Private Street 17', 'city' => 'PrivateCity', 'post_code' => 'LV-9999', 'country' => 'LV',
            ],
        ]);
    }

    private function contents(): string
    {
        return File::exists($this->logPath) ? File::get($this->logPath) : '';
    }

    public function test_request_and_response_are_correlated_without_mutating_or_exposing_customer_data(): void
    {
        $order = $this->order();
        $this->fakeCorefy($order);
        config(['services.corefy.log_enabled' => true]);

        $this->actingAs($order->user)->post('/topup/checkout/'.$order->transaction_ref.'/pay')
            ->assertRedirect('https://hpp.example.test/secure-checkout');

        $log = $this->contents();
        $this->assertStringContainsString('api.request', $log);
        $this->assertStringContainsString('api.response', $log);
        $this->assertStringContainsString('TOP-LOGGING123', $log);
        $this->assertStringContainsString('payment_card_eur_hpp', $log);
        $this->assertStringContainsString('"amount":5.15', $log);
        $this->assertStringContainsString('"country":"LV"', $log);
        $this->assertStringContainsString('"http_status":201', $log);
        preg_match_all('/"request_id":"([^"]+)"/', $log, $matches);
        $this->assertCount(2, $matches[1]);
        $this->assertSame($matches[1][0], $matches[1][1]);
        foreach (['PrivateFirstName', 'PrivateSurname', 'private-customer@example.test', '+37120000123', 'Private Street 17', 'PrivateCity', 'LV-9999', 'private-test-key', 'signature-test-key', 'https://hpp.example.test/secure-checkout'] as $private) {
            $this->assertStringNotContainsString($private, $log);
        }
        Http::assertSent(fn (ClientRequest $request): bool => $request['data']['attributes']['customer']['email'] === 'private-customer@example.test'
            && $request['data']['attributes']['customer']['address']['street'] === 'Private Street 17');
    }

    public function test_gateway_error_details_are_visible_but_echoed_secrets_and_card_data_are_not(): void
    {
        $order = $this->order();
        config(['services.corefy.log_enabled' => true]);
        Http::fake(['payments.example.test/*' => Http::response([
            'errors' => [[
                'code' => '908', 'status' => '400', 'title' => 'Routing error',
                'detail' => 'transaction destination cannot be found for routing; private-customer@example.test PrivateFirstName Private Street 17 private-test-key 4111 1111 1111 1111 CVC=123 https://secret.example/token',
                'authorization' => 'Basic private-credentials', 'card_number' => '4111111111111111', 'cvc' => '123',
            ]],
        ], 400, ['X-Request-ID' => 'provider-support-id'])]);

        $this->actingAs($order->user)->from('/topup')->post('/topup/checkout/'.$order->transaction_ref.'/pay')->assertSessionHas('error');

        $log = $this->contents();
        $this->assertStringContainsString('"http_status":400', $log);
        $this->assertStringContainsString('provider-support-id', $log);
        $this->assertStringContainsString('transaction destination cannot be found for routing', $log);
        foreach (['private-customer@example.test', 'PrivateFirstName', 'Private Street 17', 'private-test-key', '4111 1111 1111 1111', '4111111111111111', 'CVC=123', 'https://secret.example/token', 'private-credentials'] as $private) {
            $this->assertStringNotContainsString($private, $log);
        }
    }

    public function test_connection_failure_is_logged_without_logging_the_exception_request(): void
    {
        $order = $this->order();
        config(['services.corefy.log_enabled' => true]);
        Http::fake(['payments.example.test/*' => Http::failedConnection()]);

        $this->actingAs($order->user)->from('/topup')->post('/topup/checkout/'.$order->transaction_ref.'/pay')->assertSessionHas('error');

        $this->assertStringContainsString('api.connection_failed', $this->contents());
        $this->assertStringNotContainsString('private-test-key', $this->contents());
    }

    public function test_valid_webhook_and_private_api_result_are_logged_with_the_order_reference(): void
    {
        $order = $this->order();
        $order->update(['payment_requested_at' => now(), 'provider_invoice_id' => 'cpi_TOP-LOGGING123']);
        $this->fakeCorefy($order, ['status' => 'process_failed', 'resolution' => 'declined']);
        config(['services.corefy.log_enabled' => true]);

        $this->confirmCorefy($order)->assertOk();

        $log = $this->contents();
        $this->assertStringContainsString('webhook.received', $log);
        $this->assertStringContainsString('webhook.processed', $log);
        $this->assertStringContainsString('api.response', $log);
        $this->assertStringContainsString('"transaction_ref":"TOP-LOGGING123"', $log);
        $this->assertStringContainsString('"transaction_status":"failed"', $log);
        $this->assertStringContainsString('"resolution":"declined"', $log);
        $this->assertStringNotContainsString('signature-test-key', $log);
    }

    public function test_unsigned_webhook_logs_only_rejection_metadata(): void
    {
        config(['services.corefy.log_enabled' => true]);

        $this->postJson('/topup/webhook', ['message' => 'private-body@example.test', 'card_number' => '4111111111111111'], ['X-Signature' => 'private-signature'])
            ->assertForbidden();

        $log = $this->contents();
        $this->assertStringContainsString('webhook.rejected', $log);
        $this->assertStringContainsString('"signature_valid":false', $log);
        $this->assertStringNotContainsString('private-body@example.test', $log);
        $this->assertStringNotContainsString('4111111111111111', $log);
        $this->assertStringNotContainsString('private-signature', $log);
        Http::assertNothingSent();
    }

    public function test_non_json_response_is_not_dumped_into_the_log(): void
    {
        $order = $this->order();
        config(['services.corefy.log_enabled' => true]);
        Http::fake(['payments.example.test/*' => Http::response('<html>private-customer@example.test private-test-key</html>', 502)]);

        $this->actingAs($order->user)->from('/topup')->post('/topup/checkout/'.$order->transaction_ref.'/pay')->assertSessionHas('error');

        $log = $this->contents();
        $this->assertStringContainsString('non-json', $log);
        $this->assertStringContainsString('"http_status":502', $log);
        $this->assertStringNotContainsString('<html>', $log);
    }

    public function test_logging_can_be_disabled_without_changing_the_payment_redirect(): void
    {
        $order = $this->order();
        $this->fakeCorefy($order);
        config(['services.corefy.log_enabled' => false]);

        $this->actingAs($order->user)->post('/topup/checkout/'.$order->transaction_ref.'/pay')->assertRedirect('https://hpp.example.test/secure-checkout');

        $this->assertSame('', $this->contents());
    }

    public function test_unknown_fields_and_relative_payment_tokens_are_redacted(): void
    {
        config(['services.corefy.log_enabled' => true]);

        (new CorefyLogger)->record('diagnostic.test', ['payload' => [
            'unexpected_field' => 'private-unknown-value',
            'data' => ['attributes' => ['hpp_url' => '/hpp/private-session-token', 'amount' => '5.15', 'currency' => 'EUR']],
        ]]);

        $this->assertStringNotContainsString('private-unknown-value', $this->contents());
        $this->assertStringNotContainsString('private-session-token', $this->contents());
        $this->assertStringContainsString('EUR', $this->contents());
    }

    public function test_log_sink_failure_does_not_interrupt_checkout(): void
    {
        $order = $this->order();
        $this->fakeCorefy($order);
        config([
            'services.corefy.log_enabled' => true,
            'logging.channels.corefy' => ['driver' => 'monolog', 'handler' => UnavailableCorefyLogHandler::class],
        ]);
        Log::forgetChannel('corefy');

        $this->actingAs($order->user)->post('/topup/checkout/'.$order->transaction_ref.'/pay')
            ->assertRedirect('https://hpp.example.test/secure-checkout');

        $this->assertSame('cpi_TOP-LOGGING123', $order->fresh()->provider_invoice_id);
        $this->assertSame('pending', $order->fresh()->status);
    }
}

class UnavailableCorefyLogHandler extends AbstractProcessingHandler
{
    protected function write(LogRecord $record): void
    {
        throw new \RuntimeException('Diagnostic disk unavailable.');
    }
}
