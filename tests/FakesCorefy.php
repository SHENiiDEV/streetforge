<?php

namespace Tests;

use App\Models\Transaction;
use Illuminate\Http\Client\Factory;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;

trait FakesCorefy
{
    protected function configureCorefy(): void
    {
        config(['app.url' => 'https://merchant.example.test']);
        config(['services.corefy' => [
            'log_enabled' => false,
            'api_url' => 'https://payments.example.test',
            'account_id' => 'coma_test_account', 'api_key' => 'private-test-key',
            'webhook_secret' => 'signature-test-key',
            'signature_algorithm' => 'corefy', 'service_code' => 'auto',
        ]]);
        Http::swap((new Factory)->preventStrayRequests());
    }

    /** @param array<string, mixed> $attributes
     * @return array<string, mixed>
     */
    protected function corefyResource(Transaction $transaction, array $attributes = []): array
    {
        return [
            'id' => 'cpi_'.$transaction->transaction_ref,
            'type' => 'payment-invoices',
            'attributes' => array_merge([
                'reference_id' => $transaction->transaction_ref,
                'amount' => (float) $transaction->fiat_amount,
                'processed_amount' => (float) $transaction->fiat_amount,
                'currency' => $transaction->currency,
                'test_mode' => false, 'status' => 'processed', 'resolution' => 'ok',
                'flow_data' => ['action' => 'https://hpp.example.test/secure-checkout'],
            ], $attributes),
        ];
    }

    /** @param array<string, mixed> $attributes */
    protected function fakeCorefy(Transaction $transaction, array $attributes = []): void
    {
        $this->configureCorefy();
        Http::fake([
            'payments.example.test/payment-invoices' => Http::response(['data' => $this->corefyResource($transaction, ['status' => 'created'])], 201),
            'payments.example.test/payment-invoices/*' => Http::response(['data' => $this->corefyResource($transaction, $attributes)]),
        ]);
    }

    /** @param array<string, mixed>|null $resource */
    protected function confirmCorefy(Transaction $transaction, ?array $resource = null): TestResponse
    {
        $body = json_encode(['data' => $resource ?? $this->corefyResource($transaction)], JSON_THROW_ON_ERROR);
        $secret = config('services.corefy.webhook_secret');

        return $this->call('POST', '/topup/webhook', [], [], [], [
            'CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json',
            'HTTP_X_SIGNATURE' => base64_encode(sha1($secret.$body.$secret, true)),
        ], $body);
    }
}
