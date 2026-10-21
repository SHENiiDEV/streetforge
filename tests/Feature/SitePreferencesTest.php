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
use Tests\FakesCorefy;
use Tests\TestCase;

class SitePreferencesTest extends TestCase
{
    use FakesCorefy;
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
        $this->withSession(['locale' => 'sv'])->post('/preferences', ['currency' => 'EUR'])
            ->assertSessionHas('locale', 'sv')->assertSessionHas('currency', 'EUR');
    }

    public function test_old_currency_cookie_falls_back_to_eur_and_restores_language(): void
    {
        $this->withCookie('site_locale', 'nb')->withCookie('site_currency', 'GBP')
            ->get('/login')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('preferences.locale', 'nb')->where('preferences.currency', 'EUR'));
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
            'USD bundle' => ['USD', 'racer_pack', null, '23.00', 2750],
            'EUR bundle' => ['EUR', 'racer_pack', null, '23.00', 2750],
            'GBP bundle' => ['GBP', 'racer_pack', null, '23.00', 2750],
            'EUR hyper bundle' => ['EUR', 'hyper_pack', null, '92.00', 15000],
            'GBP hyper bundle' => ['GBP', 'hyper_pack', null, '92.00', 15000],
            'USD custom' => ['USD', 'custom', 1234, '11.35', 1234],
            'EUR custom' => ['EUR', 'custom', 1234, '11.35', 1234],
            'GBP custom' => ['GBP', 'custom', 1234, '11.35', 1234],
            'stale GBP preference uses EUR conversion' => ['GBP', 'custom', 1250, '11.50', 1250],
            'EUR above previous limit' => ['EUR', 'custom', 1000000, '9200.00', 1000000],
        ];
    }

    #[DataProvider('prices')]
    public function test_server_uses_fixed_eur_prices_even_with_stale_currency_preferences(string $currency, string $package, ?int $credits, string $price, int $expectedCredits): void
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
            'user_id' => $user->id, 'currency' => 'EUR',
            'fiat_amount' => $price, 'game_credits' => $expectedCredits, 'status' => 'pending',
        ]);
    }

    public function test_eur_store_does_not_rewrite_historical_order_currency_or_invoice(): void
    {
        $user = User::factory()->create();
        $legacy = Transaction::create([
            'user_id' => $user->id, 'transaction_ref' => 'TOP-LEGACYGBP',
            'gateway' => 'credit_card', 'fiat_amount' => '19.75', 'currency' => 'GBP',
            'game_credits' => 2750, 'status' => 'success', 'invoice_number' => 'INV-LEGACYGBP',
            'customer_snapshot' => ['name' => $user->full_name, 'email' => $user->email],
        ]);

        $this->actingAs($user)->withSession(['currency' => 'GBP'])->get('/topup')
            ->assertInertia(fn (Assert $page) => $page
                ->where('packages.0.fiat_amount', '23.00')->where('packages.0.currency', 'EUR')
                ->where('packages.0.base_credits', 2500)
                ->where('preferences.currency', 'EUR')->has('preferences.currencies', 1)
                ->missing('preferences.currencies.USD')->missing('preferences.currencies.GBP'));
        $this->post('/topup/order', ['package_id' => 'racer_pack', 'gateway' => 'credit_card'])->assertRedirect();
        $this->assertDatabaseHas('transactions', ['currency' => 'EUR', 'fiat_amount' => '23.00', 'status' => 'pending']);
        $this->get('/topup/checkout/'.$legacy->transaction_ref)->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('preferences.currency', 'EUR')
                ->where('transaction.currency', 'GBP')->where('transaction.fiat_amount', '19.75'));

        $this->assertSame('GBP', $legacy->fresh()->currency);
        $this->get('/invoices/'.$legacy->invoice_number.'/download')->assertOk()
            ->assertDownload('StreetForge_Invoice_'.$legacy->invoice_number.'.pdf');
        $html = view('invoices.pdf', ['transaction' => $legacy, 'company' => config('company'), 'customer' => $legacy->customer_snapshot])->render();
        $this->assertStringContainsString('£19.75', $html);
        $this->assertStringNotContainsString('€19.75', $html);
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
        $this->post('/preferences', ['currency' => 'EUR', 'locale' => 'sv'])->assertRedirect();

        $this->fakeCorefy($transaction);
        $this->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')->assertRedirect('https://hpp.example.test/secure-checkout');
        $this->confirmCorefy($transaction)->assertOk();

        $this->assertSame('2234.00', $user->fresh()->game_balance);
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id, 'currency' => 'EUR', 'fiat_amount' => '11.35', 'status' => 'success',
        ]);
        Mail::assertQueued(PaymentReceiptMail::class, fn (PaymentReceiptMail $mail): bool => $mail->locale === 'nb');
        $html = (new PaymentReceiptMail($transaction->fresh()))->locale('nb')->render();
        $this->assertStringContainsString('Betalingsbekreftelse og faktura', $html);
        $this->assertStringContainsString('€11.35 EUR', $html);
    }

    public static function disabledCurrencies(): array
    {
        return [['USD'], ['GBP']];
    }

    #[DataProvider('disabledCurrencies')]
    public function test_disabled_currency_cannot_be_selected(string $currency): void
    {
        $this->withSession(['currency' => 'EUR'])->post('/preferences', ['currency' => $currency])
            ->assertSessionHasErrors('currency')->assertSessionHas('currency', 'EUR');
    }
}
