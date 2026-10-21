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

class CustomTopupTest extends TestCase
{
    use FakesCorefy;
    use RefreshDatabase;

    public function test_store_shows_two_value_bundles_and_custom_credit_limits(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/topup')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Topup/Index')
                ->has('packages', 2)
                ->where('packages.0.id', 'racer_pack')
                ->where('packages.1.id', 'hyper_pack')
                ->where('customTopup.min_credits', 100)
                ->missing('customTopup.max_credits')
                ->where('customTopup.credits_per_usd', 100));
    }

    public static function customOrders(): array
    {
        return [
            'minimum' => [100, '0.92'],
            'exact cents' => [1234, '11.35'],
            'previous limit' => [10000, '92.00'],
            'above previous limit' => [10001, '92.01'],
            'large quantity' => [1000000, '9200.00'],
        ];
    }

    #[DataProvider('customOrders')]
    public function test_custom_order_uses_server_price_and_waits_for_payment(int $credits, string $price): void
    {
        $user = User::factory()->create();
        $balance = $user->fresh()->game_balance;

        $response = $this->actingAs($user)->post('/topup/order', [
            'package_id' => 'custom',
            'custom_credits' => $credits,
            'gateway' => 'credit_card',
            'fiat_amount' => 0.01,
            'game_credits' => 999999,
            'currency' => 'EUR',
        ]);

        $transaction = Transaction::sole();
        $response->assertRedirect('/topup/checkout/'.$transaction->transaction_ref);
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'fiat_amount' => $price,
            'game_credits' => $credits,
            'currency' => 'EUR',
            'gateway' => 'credit_card',
            'status' => 'pending',
        ]);
        $this->assertSame($balance, $user->fresh()->game_balance);
    }

    public static function invalidCreditAmounts(): array
    {
        return [
            'missing' => [null],
            'below minimum' => [99],
            'negative' => [-100],
            'fractional' => [100.5],
            'text' => ['credits'],
        ];
    }

    #[DataProvider('invalidCreditAmounts')]
    public function test_invalid_custom_quantity_does_not_create_order(mixed $credits): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->from('/topup')->post('/topup/order', [
            'package_id' => 'custom',
            'custom_credits' => $credits,
            'gateway' => 'credit_card',
        ])->assertRedirect('/topup')->assertSessionHasErrors('custom_credits');

        $this->assertDatabaseCount('transactions', 0);
    }

    public static function unsupportedGateways(): array
    {
        return [
            'bank transfer' => ['bank_transfer'],
            'crypto' => ['crypto_pay'],
            'wise' => ['wise'],
        ];
    }

    #[DataProvider('unsupportedGateways')]
    public function test_non_card_gateway_is_rejected(string $gateway): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->from('/topup')->post('/topup/order', [
            'package_id' => 'racer_pack',
            'gateway' => $gateway,
        ])->assertRedirect('/topup')->assertSessionHasErrors('gateway');

        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_unknown_package_does_not_create_order(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/topup/order', [
            'package_id' => 'unknown',
            'gateway' => 'credit_card',
        ])->assertSessionHasErrors('package_id');

        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_guest_cannot_create_custom_order(): void
    {
        $this->post('/topup/order', [
            'package_id' => 'custom',
            'custom_credits' => 1000,
            'gateway' => 'credit_card',
        ])->assertRedirect('/login');

        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_value_bundle_keeps_its_price_and_bonus_when_custom_quantity_is_sent(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/topup/order', [
            'package_id' => 'hyper_pack',
            'custom_credits' => 1234,
            'gateway' => 'credit_card',
        ])->assertRedirect();

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'fiat_amount' => 92,
            'game_credits' => 15000,
            'status' => 'pending',
        ]);
    }

    public function test_custom_order_credits_wallet_and_issues_receipt_after_payment(): void
    {
        $user = User::factory()->create(['game_balance' => 500]);
        Mail::fake();
        Storage::fake('public');
        $this->actingAs($user)->post('/topup/order', [
            'package_id' => 'custom',
            'custom_credits' => 1234,
            'gateway' => 'credit_card',
        ])->assertRedirect();
        $transaction = Transaction::sole();

        $this->fakeCorefy($transaction);
        $this->post('/topup/checkout/'.$transaction->transaction_ref.'/pay')
            ->assertRedirect('https://hpp.example.test/secure-checkout');
        $this->assertSame('500.00', $user->fresh()->game_balance);
        $this->confirmCorefy($transaction)->assertOk();

        $this->assertSame('1734.00', $user->fresh()->game_balance);
        $this->assertSame('success', $transaction->fresh()->status);
        Storage::disk('public')->assertExists($transaction->fresh()->invoice_path);
        Mail::assertQueued(PaymentReceiptMail::class);
    }
}
