<?php

namespace App\Services;

use App\Mail\PaymentReceiptMail;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use RuntimeException;

class CorefyPaymentService
{
    public function __construct(private CorefyClient $client, private InvoiceService $invoices) {}

    public function start(Transaction $transaction): string
    {
        if (! in_array($transaction->currency, config('store.enabled_currencies'), true)) {
            throw new RuntimeException('This payment currency is currently unavailable.');
        }
        if (! $this->client->configured()) {
            throw new RuntimeException('Corefy configuration is incomplete.');
        }
        $this->client->validateCustomer($transaction);
        $existingUrl = DB::transaction(function () use ($transaction): ?string {
            $order = Transaction::query()->lockForUpdate()->findOrFail($transaction->id);
            if ($order->status !== 'pending') {
                throw new RuntimeException('This order is no longer payable.');
            }
            if ($order->provider_invoice_id && $this->client->validPaymentUrl($order->payment_url)) {
                return $order->payment_url;
            }
            if ($order->payment_requested_at) {
                throw new RuntimeException('This payment is awaiting reconciliation.');
            }
            $order->update(['payment_requested_at' => now()]);

            return null;
        });
        if ($existingUrl) {
            return $existingUrl;
        }

        // A stable reference and reservation prevent duplicate invoices after timeouts or repeated clicks.
        $resource = $this->client->createInvoice($transaction);
        $invoiceId = $resource['id'] ?? null;
        $attributes = $resource['attributes'] ?? [];
        if (! is_string($invoiceId) || $invoiceId === '') {
            throw new RuntimeException('Corefy invoice identifier is missing.');
        }
        $this->assertMatches($transaction, $resource);
        $url = $attributes['flow_data']['action'] ?? $attributes['hpp_url'] ?? null;
        if (! $this->client->validPaymentUrl($url)) {
            throw new RuntimeException('Corefy payment URL is missing or invalid.');
        }
        DB::transaction(function () use ($transaction, $invoiceId, $url): void {
            $order = Transaction::query()->lockForUpdate()->findOrFail($transaction->id);
            if ($order->provider_invoice_id && $order->provider_invoice_id !== $invoiceId) {
                throw new RuntimeException('Corefy invoice identifier mismatch.');
            }
            $order->update(['provider_invoice_id' => $invoiceId, 'payment_url' => $url]);
        });

        return $url;
    }

    /** @param array<string, mixed> $resource */
    public function synchronize(Transaction $transaction, array $resource): void
    {
        DB::transaction(function () use ($transaction, $resource): void {
            $order = Transaction::query()->lockForUpdate()->findOrFail($transaction->id);
            $this->assertMatches($order, $resource);
            if (! $order->payment_requested_at || ($order->provider_invoice_id && $order->provider_invoice_id !== $resource['id'])) {
                throw new RuntimeException('Corefy invoice does not belong to this payment.');
            }
            $attributes = $resource['attributes'];
            $status = $attributes['status'] ?? '';
            $changes = [
                'provider_invoice_id' => $resource['id'],
                'gateway_response' => [
                    'id' => $resource['id'], 'status' => $status,
                    'resolution' => $attributes['resolution'] ?? null,
                    'amount' => $attributes['amount'], 'currency' => $attributes['currency'],
                ],
            ];
            if ($status === 'processed') {
                if ($this->minorUnits($attributes['processed_amount'] ?? null) !== $this->minorUnits($order->fiat_amount)) {
                    throw new RuntimeException('Corefy captured amount mismatch.');
                }
                if (! $order->completed_at && $order->status !== 'refunded') {
                    $order->user()->increment('game_balance', $order->game_credits);
                    $changes += ['status' => 'success', 'completed_at' => now()];
                }
            } elseif ($status === 'refunded') {
                if ($order->completed_at && ! $order->credits_reversed_at) {
                    $order->user()->decrement('game_balance', $order->game_credits);
                    $changes['credits_reversed_at'] = now();
                }
                $changes['status'] = 'refunded';
            } elseif (in_array($status, ['process_failed', 'authorize_failed', 'expired', 'terminated'], true) && ! $order->completed_at && $order->status !== 'refunded') {
                $changes['status'] = 'failed';
            }
            $order->update($changes);
        });

        $this->issueReceipt($transaction);
    }

    /** @param array<string, mixed> $resource */
    private function assertMatches(Transaction $transaction, array $resource): void
    {
        $attributes = $resource['attributes'] ?? [];
        if (($resource['type'] ?? null) !== 'payment-invoices'
            || ! is_string($resource['id'] ?? null) || $resource['id'] === ''
            || ($attributes['reference_id'] ?? null) !== $transaction->transaction_ref
            || ($attributes['currency'] ?? null) !== $transaction->currency
            || ($attributes['test_mode'] ?? null) !== false
            || $this->minorUnits($attributes['amount'] ?? null) !== $this->minorUnits($transaction->fiat_amount)) {
            throw new RuntimeException('Corefy invoice does not match the order.');
        }
    }

    private function minorUnits(mixed $amount): ?int
    {
        if (! is_string($amount) && ! is_int($amount) && ! is_float($amount)) {
            return null;
        }
        if (! preg_match('/^(\d{1,10})(?:\.(\d{1,2})0*)?$/D', (string) $amount, $matches)) {
            return null;
        }

        return ((int) $matches[1] * 100) + (int) str_pad($matches[2] ?? '', 2, '0');
    }

    private function issueReceipt(Transaction $transaction): void
    {
        DB::transaction(function () use ($transaction): void {
            $order = Transaction::query()->lockForUpdate()->findOrFail($transaction->id);
            if ($order->status === 'success' && ! $order->invoice_path) {
                $this->invoices->generate($order);
            }
        });

        DB::transaction(function () use ($transaction): void {
            $order = Transaction::query()->lockForUpdate()->findOrFail($transaction->id);
            if ($order->status !== 'success' || $order->receipt_queued_at) {
                return;
            }
            Mail::to($order->customer_snapshot['email'] ?? $order->user->email)
                ->queue((new PaymentReceiptMail($order))->locale($order->customer_snapshot['locale'] ?? 'en'));
            $order->update(['receipt_queued_at' => now()]);
        });
    }
}
