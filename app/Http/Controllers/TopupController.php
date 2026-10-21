<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\CorefyClient;
use App\Services\CorefyPaymentService;
use App\Services\CurrencyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

    public function index(Request $request, CurrencyService $currencyService): Response
    {
        $user = $request->user();

        $transactions = Transaction::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->take(15)
            ->get();

        $currency = $currencyService->selected();
        $packages = array_map(fn (array $package): array => array_merge($package, [
            'fiat_amount' => $currencyService->fromUsdCents((int) round($package['fiat_amount'] * 100), $currency),
            'currency' => $currency,
            'base_credits' => (int) round($package['fiat_amount'] * 100),
        ]), $this->packages);

        return Inertia::render('Topup/Index', [
            'packages' => $packages,
            'customTopup' => array_merge($this->customTopup, ['currency' => $currency]),
            'transactions' => $transactions,
        ]);
    }

    public function createOrder(Request $request, CurrencyService $currencyService): RedirectResponse
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
        $currency = $currencyService->selected();
        $usdCents = $validated['package_id'] === 'custom'
            ? (int) $validated['custom_credits']
            : (int) round($pkg['fiat_amount'] * 100);
        $ref = 'TOP-'.strtoupper(Str::random(10));
        $invoiceNumber = 'INV-'.date('Y').'-'.strtoupper((string) Str::ulid());

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'transaction_ref' => $ref,
            'gateway' => 'credit_card',
            'fiat_amount' => $currencyService->fromUsdCents($usdCents, $currency),
            'currency' => $currency,
            'game_credits' => $pkg['game_credits'],
            'status' => 'pending',
            'invoice_number' => $invoiceNumber,
            'customer_snapshot' => [
                'locale' => app()->getLocale(),
                'name' => $user->full_name,
                'first_name' => $user->name,
                'surname' => $user->surname,
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

    public function checkout(Transaction $transaction, Request $request, CorefyClient $client): Response
    {
        if ($transaction->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('Topup/Checkout', [
            'transaction' => $transaction,
            'company' => config('company'),
            'paymentAvailable' => $client->configured(),
            'returned' => $request->boolean('returned'),
        ]);
    }

    public function processPayment(Transaction $transaction, Request $request, CorefyPaymentService $payments): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($transaction->user_id === $request->user()->id, 403);
        if ($transaction->status !== 'pending') {
            return redirect()->route('topup.checkout', ['transaction' => $transaction->transaction_ref]);
        }
        try {
            $url = $payments->start($transaction);
        } catch (\RuntimeException $exception) {
            Log::warning('Corefy checkout could not be initialized.', ['transaction_ref' => $transaction->transaction_ref, 'reason' => $exception->getMessage()]);

            return back()->with('error', __('Unable to open secure payment. Please try again later or contact support with your order reference.'));
        }

        return Inertia::location($url);
    }
}
