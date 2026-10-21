<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\CorefyClient;
use App\Services\CorefyPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class CorefyWebhookController extends Controller
{
    public function __invoke(Request $request, CorefyClient $client, CorefyPaymentService $payments): JsonResponse
    {
        if (! $client->validSignature($request->getContent(), $request->header('X-Signature'))) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }
        $data = $request->validate([
            'data.type' => ['required', 'in:payment-invoices'],
            'data.id' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9_-]+$/'],
            'data.attributes.reference_id' => ['required', 'string', 'max:255'],
        ])['data'];
        $transaction = Transaction::where('transaction_ref', $data['attributes']['reference_id'])->first();
        if (! $transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }
        if ($transaction->provider_invoice_id && $transaction->provider_invoice_id !== $data['id']) {
            return response()->json(['error' => 'Invoice mismatch'], 422);
        }
        try {
            $resource = $client->invoice($data['id']);
            if (($resource['id'] ?? null) !== $data['id']) {
                return response()->json(['error' => 'Invoice mismatch'], 422);
            }
            $payments->synchronize($transaction, $resource);
        } catch (RuntimeException $exception) {
            Log::warning('Corefy callback could not be verified.', ['transaction_ref' => $transaction->transaction_ref, 'reason' => $exception->getMessage()]);

            return response()->json(['error' => 'Payment verification unavailable'], 503);
        }

        return response()->json(['status' => 'ok']);
    }
}
