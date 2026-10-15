<?php

namespace App\Http\Controllers;

use App\Mail\PaymentReceiptMail;
use App\Models\Transaction;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TopupController extends Controller
{
    private array $packages = [
        [
            'id' => 'racer_pack',
            'name' => 'Pro Racer Pack',
            'fiat_amount' => 25.00,
            'currency' => 'USD',
            'game_credits' => 2750,
            'bonus_percent' => 10,
            'badge' => '+10% BONUS',
            'popular' => true,
        ],
        [
            'id' => 'hyper_pack',
            'name' => 'Apex Hyper Syndicate Vault',
            'fiat_amount' => 100.00,
            'currency' => 'USD',
            'game_credits' => 15000,
            'bonus_percent' => 50,
            'badge' => '+50% MEGA VALUE',
            'popular' => false,
        ],
    ];

    private array $customTopup = [
        'min_credits' => 100,
        'credits_per_usd' => 100,
        'currency' => 'USD',
    ];

    public function index(Request $request): Response
    {
        $user = $request->user();

        $transactions = Transaction::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->take(15)
            ->get();

        return Inertia::render('Topup/Index', [
            'packages' => $this->packages,
            'customTopup' => $this->customTopup,
            'transactions' => $transactions,
        ]);
    }

    public function createOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'package_id' => ['required', 'string', Rule::in([...array_column($this->packages, 'id'), 'custom'])],
            'gateway' => ['required', 'string', 'in:credit_card'],
            'custom_credits' => [
                'exclude_unless:package_id,custom',
                'required',
                'integer',
                'min:'.$this->customTopup['min_credits'],
            ],
        ]);

        $pkg = $validated['package_id'] === 'custom'
            ? [
                'fiat_amount' => (int) $validated['custom_credits'] / $this->customTopup['credits_per_usd'],
                'currency' => $this->customTopup['currency'],
                'game_credits' => (int) $validated['custom_credits'],
            ]
            : collect($this->packages)->firstWhere('id', $validated['package_id']);

        $user = $request->user();
        $ref = 'TOP-'.strtoupper(Str::random(10));
        $invoiceNumber = 'INV-'.date('Y').'-'.str_pad((string) (Transaction::count() + 1001), 6, '0', STR_PAD_LEFT);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'transaction_ref' => $ref,
            'gateway' => 'credit_card',
            'fiat_amount' => $pkg['fiat_amount'],
            'currency' => $pkg['currency'],
            'game_credits' => $pkg['game_credits'],
            'status' => 'pending',
            'invoice_number' => $invoiceNumber,
            'customer_snapshot' => [
                'name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'street' => $user->street,
                'city' => $user->city,
                'country' => $user->country,
                'post_code' => $user->post_code,
            ],
        ]);

        return redirect()->route('topup.checkout', ['transaction' => $transaction->transaction_ref]);
    }

    public function checkout(Transaction $transaction, Request $request): Response|RedirectResponse
    {
        if ($transaction->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($transaction->status === 'success') {
            return redirect()->route('topup.index')->with('info', 'This payment has already been completed.');
        }

        return Inertia::render('Topup/Checkout', [
            'transaction' => $transaction,
            'company' => config('company'),
        ]);
    }

    public function processMockPayment(Transaction $transaction, Request $request, InvoiceService $invoiceService): RedirectResponse
    {
        if ($transaction->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($transaction->status === 'success') {
            return redirect()->route('topup.index')->with('info', 'This payment has already been completed.');
        }

        $user = $transaction->user;

        // 1. Mark transaction as success
        $transaction->update([
            'status' => 'success',
            'completed_at' => now(),
            'gateway_response' => [
                'payment_intent_id' => 'mock_pi_'.Str::random(16),
                'status' => 'succeeded',
                'captured_amount' => $transaction->fiat_amount,
                'payment_method' => $transaction->gateway,
            ],
        ]);

        // 2. Credit game balance
        $user->increment('game_balance', $transaction->game_credits);

        // 3. Generate PDF Invoice
        try {
            $invoiceService->generate($transaction);
        } catch (\Throwable $e) {
            report($e);
        }

        // 4. Send Email
        try {
            Mail::to($user->email)->queue(new PaymentReceiptMail($transaction));
        } catch (\Throwable $e) {
            // mail logging
        }

        return redirect()->route('topup.index')->with('success', 'Payment successful! +'.number_format($transaction->game_credits).' CR added to your wallet.');
    }

    /**
     * Webhook endpoint for automated payment gateway notifications.
     */
    public function handleWebhook(Request $request, InvoiceService $invoiceService): JsonResponse
    {
        $payload = $request->all();
        $signature = $request->header('X-Apex-Signature');

        // Optional HMAC signature check
        $secret = config('services.payment_webhook_secret', 'apex_secret_key_2026');
        $expectedSignature = hash_hmac('sha256', (string) $request->getContent(), $secret);

        if ($signature && ! hash_equals($expectedSignature, $signature)) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $ref = $payload['transaction_ref'] ?? null;
        if (! $ref) {
            return response()->json(['error' => 'Missing transaction reference'], 422);
        }

        $transaction = Transaction::where('transaction_ref', $ref)->first();
        if (! $transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        if ($transaction->status === 'success') {
            return response()->json(['status' => 'already_processed']);
        }

        $transaction->update([
            'status' => 'success',
            'completed_at' => now(),
            'gateway_response' => $payload,
        ]);

        $transaction->user->increment('game_balance', $transaction->game_credits);

        try {
            $invoiceService->generate($transaction);
            Mail::to($transaction->user->email)->queue(new PaymentReceiptMail($transaction));
        } catch (\Throwable $e) {
            report($e);
        }

        return response()->json([
            'status' => 'ok',
            'message' => 'Transaction processed and balance credited.',
            'invoice_number' => $transaction->invoice_number,
        ]);
    }
}
