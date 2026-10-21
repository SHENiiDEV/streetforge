<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use App\Services\CorefyClient;
use App\Services\CorefyPaymentService;
use Illuminate\Console\Command;
use RuntimeException;

class ReconcileCorefyPayment extends Command
{
    protected $signature = 'payments:reconcile {reference : StreetForge transaction reference} {--invoice= : Corefy invoice ID, if creation timed out}';

    protected $description = 'Reconcile a payment against the private Corefy API without issuing a new charge';

    public function handle(CorefyClient $client, CorefyPaymentService $payments): int
    {
        $transaction = Transaction::where('transaction_ref', $this->argument('reference'))->first();
        if (! $transaction) {
            $this->error('Transaction not found.');

            return self::FAILURE;
        }
        $invoiceId = $transaction->provider_invoice_id ?: $this->option('invoice');
        if (! is_string($invoiceId) || ! preg_match('/^[a-zA-Z0-9_-]{1,255}$/D', $invoiceId)) {
            $this->error('Supply the invoice ID from Corefy with --invoice. No new payment will be created.');

            return self::FAILURE;
        }
        try {
            $resource = $client->invoice($invoiceId, $transaction->transaction_ref);
            if (($resource['id'] ?? null) !== $invoiceId) {
                throw new RuntimeException('Invoice identifier mismatch.');
            }
            $payments->synchronize($transaction, $resource);
        } catch (RuntimeException $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }
        $this->info($transaction->transaction_ref.': '.$transaction->fresh()->status);

        return self::SUCCESS;
    }
}
