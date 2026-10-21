<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\CorefyClient;
use App\Services\CorefyLogger;
use App\Services\CorefyPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class CorefyWebhookController extends Controller
{
    public function __invoke(Request $request, CorefyClient $client, CorefyPaymentService $payments, CorefyLogger $logger): JsonResponse
    {
        $validSignature = $client->validSignature($request->getContent(), $request->header('X-Signature'));
        $context = [
            'request_id' => (string) Str::uuid(),
            'signature_present' => $request->hasHeader('X-Signature'),
            'signature_valid' => $validSignature,
            'bytes' => strlen($request->getContent()),
        ];
        if (! $validSignature) {
            $logger->record('webhook.rejected', $context + ['http_status' => 403, 'reason' => 'Invalid signature'], 'warning');

            return response()->json(['error' => 'Invalid signature'], 403);
        }
        $logger->record('webhook.received', $context + ['payload' => $request->all()]);
        try {
            $data = $request->validate([
                'data.type' => ['required', 'in:payment-invoices'],
                'data.id' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9_-]+$/'],
                'data.attributes.reference_id' => ['required', 'string', 'max:255'],
            ])['data'];
        } catch (ValidationException $exception) {
            $logger->record('webhook.rejected', $context + ['http_status' => 422, 'reason' => 'Invalid payload'], 'warning');
            throw $exception;
        }
        $context += ['transaction_ref' => $data['attributes']['reference_id'], 'provider_invoice_id' => $data['id']];
        $transaction = Transaction::where('transaction_ref', $data['attributes']['reference_id'])->first();
        if (! $transaction) {
            $logger->record('webhook.rejected', $context + ['http_status' => 404, 'reason' => 'Transaction not found'], 'warning');

            return response()->json(['error' => 'Transaction not found'], 404);
        }
        if ($transaction->provider_invoice_id && $transaction->provider_invoice_id !== $data['id']) {
            $logger->record('webhook.rejected', $context + ['http_status' => 422, 'reason' => 'Invoice mismatch'], 'warning');

            return response()->json(['error' => 'Invoice mismatch'], 422);
        }
        try {
            $resource = $client->invoice($data['id'], $transaction->transaction_ref);
            if (($resource['id'] ?? null) !== $data['id']) {
                $logger->record('webhook.rejected', $context + ['http_status' => 422, 'reason' => 'API invoice mismatch'], 'warning');

                return response()->json(['error' => 'Invoice mismatch'], 422);
            }
            $payments->synchronize($transaction, $resource);
        } catch (RuntimeException $exception) {
            $logger->record('webhook.rejected', $context + ['http_status' => 503, 'reason' => $exception->getMessage()], 'warning');
            Log::warning('Corefy callback could not be verified.', ['transaction_ref' => $transaction->transaction_ref, 'reason' => $exception->getMessage()]);

            return response()->json(['error' => 'Payment verification unavailable'], 503);
        }

        $logger->record('webhook.processed', $context + [
            'http_status' => 200, 'transaction_status' => $transaction->fresh()->status,
            'status' => $resource['attributes']['status'] ?? null,
            'resolution' => $resource['attributes']['resolution'] ?? null,
        ]);

        return response()->json(['status' => 'ok']);
    }
}
