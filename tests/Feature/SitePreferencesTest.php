<?php

namespace Tests\Feature;

use App\Mail\PaymentReceiptMail;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class SitePreferencesTest extends TestCase
{
    use RefreshDatabase;

    public static function languages(): array
    {
        return [['en'], ['nb'], ['sv']];
    }

    #[DataProvider('languages')]
    public function test_guest_can_save_language_and_currency_and_keep_them_across_pages(string $locale): void
    {
        $this->from('/login')->post('/preferences', ['locale' => $locale, 'currency' => 'EUR'])
            ->assertRedirect('/login')
            ->assertSessionHas('locale', $locale)
            ->assertSessionHas('currency', 'EUR')
            ->assertCookie('site_locale', $locale)
            ->assertCookie('site_currency', 'EUR');

        $this->get('/login')->assertOk()->assertSee('lang="'.$locale.'"', false)
            ->assertInertia(fn (Assert $page) => $page
                ->where('preferences.locale', $locale)
                ->where('preferences.currency', 'EUR'));
        $this->get('/how-it-works')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('preferences.locale', $locale));
    }

    public function test_changing_currency_preserves_selected_language(): void
    {
        $this->withSession(['locale' => 'sv'])->post('/preferences', ['currency' => 'GBP'])
            ->assertSessionHas('locale', 'sv')->assertSessionHas('currency', 'GBP');
    }

    public function test_saved_cookies_restore_preferences_without_a_session(): void
    {
        $this->withCookie('site_locale', 'nb')->withCookie('site_currency', 'GBP')
            ->get('/login')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('preferences.locale', 'nb')->where('preferences.currency', 'GBP'));
    }

    public function test_unsupported_preferences_do_not_replace_existing_choices(): void
    {
        $this->withSession(['locale' => 'sv', 'currency' => 'EUR'])
            ->post('/preferences', ['locale' => 'xx', 'currency' => 'NOK'])
            ->assertSessionHasErrors(['locale', 'currency'])
            ->assertSessionHas('locale', 'sv')->assertSessionHas('currency', 'EUR');
    }

    public static function prices(): array
    {
        return [
            'USD bundle' => ['USD', 'racer_pack', null, '25.00', 2750],
            'EUR bundle' => ['EUR', 'racer_pack', null, '23.00', 2750],
            'GBP bundle' => ['GBP', 'racer_pack', null, '19.75', 2750],
            'EUR hyper bundle' => ['EUR', 'hyper_pack', null, '92.00', 15000],
            'GBP hyper bundle' => ['GBP', 'hyper_pack', null, '79.00', 15000],
            'USD custom' => ['USD', 'custom', 1234, '12.34', 1234],
            'EUR custom' => ['EUR', 'custom', 1234, '11.35', 1234],
            'GBP custom' => ['GBP', 'custom', 1234, '9.75', 1234],
            'GBP half cent rounds up' => ['GBP', 'custom', 1250, '9.88', 1250],
            'EUR above previous limit' => ['EUR', 'custom', 1000000, '9200.00', 1000000],
        ];
    }

    #[DataProvider('prices')]
    public function test_server_uses_fixed_prices_in_selected_currency(string $currency, string $package, ?int $credits, string $price, int $expectedCredits): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->withSession(['currency' => $currency])->post('/topup/order', [
            'package_id' => $package,
            'custom_credits' => $credits,
            'gateway' => 'credit_card',
            'currency' => 'USD',
            'fiat_amount' => 0.01,
            'exchange_rate' => 1,
        ])->assertRedirect();

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id, 'currency' => $currency,
            'fiat_amount' => $price, 'game_credits' => $expectedCredits, 'status' => 'pending',
        ]);
    }

    public function test_store_prices_and_checkout_use_the_order_currency_after_switching(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->withSession(['currency' => 'GBP'])->get('/topup')
            ->assertInertia(fn (Assert $page) => $page
                ->where('packages.0.fiat_amount', '19.75')->where('packages.0.currency', 'GBP')
                ->where('packages.0.base_credits', 2500));
        $this->post('/topup/order', ['package_id' => 'racer_pack', 'gateway' => 'credit_card'])->assertRedirect();
        $transaction = Transaction::sole();

        $this->post('/preferences', ['currency' => 'EUR'])->assertRedirect();
        $this->get('/topup/checkout/'.$transaction->transaction_ref)->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('preferences.currency', 'EUR')
                ->where('transaction.currency', 'GBP')->where('transaction.fiat_amount', '19.75'));

        $this->assertSame('GBP', $transaction->fresh()->currency);
        $this->get('/invoices/'.$transaction->invoice_number.'/download')->assertOk()
            ->assertDownload('StreetForge_Invoice_'.$transaction->invoice_number.'.pdf');
        $html = view('invoices.pdf', ['transaction' => $transaction, 'company' => config('company'), 'customer' => $transaction->customer_snapshot])->render();
        $this->assertStringContainsString('£19.75', $html);
        $this->assertStringNotContainsString('$19.75', $html);
    }

    public function test_custom_quantity_error_is_localized(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->withSession(['locale' => 'sv'])->post('/topup/order', [
            'package_id' => 'custom', 'custom_credits' => 99, 'gateway' => 'credit_card',
        ])->assertSessionHasErrors(['custom_credits' => 'Antal krediter måste vara minst 100.']);

        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_receipt_keeps_order_language_and_currency_after_preferences_change(): void
    {
        $user = User::factory()->create(['game_balance' => 1000]);
        Mail::fake();
        Storage::fake('public');
        $this->actingAs($user)->withSession(['currency' => 'EUR', 'locale' => 'nb'])
            ->post('/topup/order', ['package_id' => 'custom', 'custom_credits' => 1234, 'gateway' => 'credit_card'])
            ->assertRedirect();
        $transaction = Transaction::sole();
        $this->post('/preferences', ['currency' => 'GBP', 'locale' => 'sv'])->assertRedirect();

        $this->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')->assertRedirect('/topup');

        $this->assertSame('2234.00', $user->fresh()->game_balance);
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id, 'currency' => 'EUR', 'fiat_amount' => '11.35', 'status' => 'success',
        ]);
        Mail::assertQueued(PaymentReceiptMail::class, fn (PaymentReceiptMail $mail): bool => $mail->locale === 'nb');
        $html = (new PaymentReceiptMail($transaction->fresh()))->locale('nb')->render();
        $this->assertStringContainsString('Betalingsbekreftelse og faktura', $html);
        $this->assertStringContainsString('€11.35 EUR', $html);
    }
}
