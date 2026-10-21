<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\FakesCorefy;
use Tests\TestCase;

class TopupAndInvoiceTest extends TestCase
{
    use FakesCorefy;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Storage::fake('public');
    }

    public function test_user_can_initiate_topup_order(): void
    {
        $user = User::first();

        $response = $this->actingAs($user)->post('/topup/order', [
            'package_id' => 'racer_pack',
            'gateway' => 'credit_card',
        ]);

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'fiat_amount' => 25.00,
            'game_credits' => 2750.00,
            'status' => 'pending',
        ]);

        $tx = Transaction::latest('id')->first();
        $response->assertRedirect('/topup/checkout/'.$tx->transaction_ref);
    }

    public function test_user_can_complete_payment_and_credits_are_added(): void
    {
        $user = User::first();
        $initialBalance = $user->game_balance;

        $tx = Transaction::create([
            'user_id' => $user->id,
            'transaction_ref' => 'TOP-TEST12345',
            'gateway' => 'credit_card',
            'fiat_amount' => 50.00,
            'currency' => 'USD',
            'game_credits' => 6000.00,
            'status' => 'pending',
            'invoice_number' => 'INV-2026-999999',
            'customer_snapshot' => [
                'name' => $user->full_name,
                'email' => $user->email,
                'country' => $user->country,
            ],
        ]);

        $this->fakeCorefy($tx);
        $response = $this->actingAs($user)->post('/topup/checkout/'.$tx->transaction_ref.'/pay');
        $response->assertRedirect('https://hpp.example.test/secure-checkout');
        $this->assertSame((string) $initialBalance, $user->fresh()->game_balance);
        $this->confirmCorefy($tx)->assertOk();

        $user->refresh();
        $this->assertEquals($initialBalance + 6000.00, $user->game_balance);

        $tx->refresh();
        $this->assertEquals('success', $tx->status);
        $this->assertNotNull($tx->invoice_path);
    }

    public function test_unsigned_legacy_webhook_cannot_credit_balance(): void
    {
        $user = User::first();
        $initialBalance = $user->game_balance;

        $tx = Transaction::create([
            'user_id' => $user->id,
            'transaction_ref' => 'TOP-WHK987654',
            'gateway' => 'stripe_mock',
            'fiat_amount' => 100.00,
            'currency' => 'USD',
            'game_credits' => 15000.00,
            'status' => 'pending',
            'invoice_number' => 'INV-2026-888888',
            'customer_snapshot' => [
                'name' => $user->full_name,
                'email' => $user->email,
                'country' => $user->country,
            ],
        ]);

        $response = $this->postJson('/topup/webhook', [
            'transaction_ref' => 'TOP-WHK987654',
            'event' => 'payment.succeeded',
        ]);

        $response->assertForbidden();

        $user->refresh();
        $this->assertSame((string) $initialBalance, $user->game_balance);

        $tx->refresh();
        $this->assertSame('pending', $tx->status);
    }
}
