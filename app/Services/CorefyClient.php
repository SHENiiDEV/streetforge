<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class CorefyClient
{
    public function __construct(private CorefyLogger $logger) {}

    /** Countries currently offered by the registration form; Corefy requires ISO 3166-1 alpha-2. */
    private const COUNTRY_CODES = [
        'United States' => 'US', 'United Kingdom' => 'GB', 'Germany' => 'DE', 'France' => 'FR',
        'Cyprus' => 'CY', 'Canada' => 'CA', 'Australia' => 'AU', 'Netherlands' => 'NL',
        'Spain' => 'ES', 'Italy' => 'IT', 'Japan' => 'JP', 'South Korea' => 'KR',
        'Singapore' => 'SG', 'United Arab Emirates' => 'AE', 'Switzerland' => 'CH', 'Sweden' => 'SE',
        'Norway' => 'NO', 'Finland' => 'FI', 'Denmark' => 'DK', 'Austria' => 'AT',
        'Belgium' => 'BE', 'Ireland' => 'IE', 'New Zealand' => 'NZ', 'Poland' => 'PL',
        'Czech Republic' => 'CZ', 'Portugal' => 'PT', 'Greece' => 'GR', 'Estonia' => 'EE',
        'Latvia' => 'LV', 'Lithuania' => 'LT', 'Brazil' => 'BR', 'Mexico' => 'MX',
        'Argentina' => 'AR', 'Chile' => 'CL', 'India' => 'IN', 'South Africa' => 'ZA',
    ];

    public function validateCustomer(Transaction $transaction): void
    {
        $this->countryCode($transaction->customer_snapshot['country'] ?? '');
    }

    private function countryCode(?string $country): string
    {
        $country = trim($country ?? '');
        if ($country === '' || preg_match('/^[A-Z]{2}$/D', $country)) {
            return $country;
        }
        if (! isset(self::COUNTRY_CODES[$country])) {
            throw new RuntimeException('Customer country must be a supported country or ISO code.');
        }

        return self::COUNTRY_CODES[$country];
    }

    public function configured(): bool
    {
        return filled(config('services.corefy.account_id'))
            && filled(config('services.corefy.api_key'))
            && filled(config('services.corefy.webhook_secret'))
            && $this->validPaymentUrl(config('services.corefy.api_url'))
            && $this->validPaymentUrl(config('app.url'));
    }

    /** @return array<string, mixed> */
    public function createInvoice(Transaction $transaction): array
    {
        $customer = $transaction->customer_snapshot;
        $service = config('services.corefy.service_code', 'auto');
        if ($service === 'auto') {
            $service = 'payment_card_'.strtolower($transaction->currency).'_hpp';
        }
        $merchantUrl = rtrim((string) config('app.url'), '/');
        if (! $this->validPaymentUrl($merchantUrl)) {
            throw new RuntimeException('APP_URL must be the public HTTPS merchant URL.');
        }
        $returnUrl = $merchantUrl.route('topup.checkout', ['transaction' => $transaction->transaction_ref, 'returned' => 1], false);

        return $this->request('POST', '/payment-invoices', [
            'data' => [
                'type' => 'payment-invoices',
                'attributes' => [
                    'reference_id' => $transaction->transaction_ref,
                    'amount' => (float) $transaction->fiat_amount,
                    'currency' => $transaction->currency,
                    'service' => $service,
                    'flow' => 'charge',
                    'test_mode' => false,
                    'description' => 'StreetForge Credits '.$transaction->transaction_ref,
                    'customer' => [
                        'reference_id' => 'user_'.$transaction->user_id,
                        'email' => $customer['email'],
                        'name' => $customer['name'],
                        'first_name' => $customer['first_name'] ?? $transaction->user->name,
                        'surname' => $customer['surname'] ?? $transaction->user->surname,
                        'phone' => $customer['phone'] ?? '',
                        'address' => [
                            'full_address' => $customer['street'] ?? '',
                            'country' => $this->countryCode($customer['country'] ?? ''),
                            'city' => $customer['city'] ?? '',
                            'street' => $customer['street'] ?? '',
                            'post_code' => $customer['post_code'] ?? '',
                        ],
                    ],
                    'return_url' => $returnUrl,
                    'return_urls' => ['success' => $returnUrl, 'pending' => $returnUrl, 'fail' => $returnUrl],
                    'callback_url' => $merchantUrl.route('topup.webhook', [], false),
                    'metadata' => ['transaction_ref' => $transaction->transaction_ref, 'source' => 'streetforge'],
                ],
            ],
        ], ['transaction_ref' => $transaction->transaction_ref]);
    }

    /** @return array<string, mixed> */
    public function invoice(string $invoiceId, ?string $transactionReference = null): array
    {
        return $this->request('GET', '/payment-invoices/'.rawurlencode($invoiceId), [], ['provider_invoice_id' => $invoiceId, 'transaction_ref' => $transactionReference]);
    }

    public function validSignature(string $body, ?string $signature): bool
    {
        $secret = (string) config('services.corefy.webhook_secret');
        if ($secret === '' || ! is_string($signature) || $signature === '') {
            return false;
        }

        $expected = match (config('services.corefy.signature_algorithm')) {
            'corefy' => base64_encode(sha1($secret.$body.$secret, true)),
            'hmac_sha256' => hash_hmac('sha256', $body, $secret),
            'hmac_sha1' => hash_hmac('sha1', $body, $secret),
            default => '',
        };

        return $expected !== '' && hash_equals($expected, $signature);
    }

    public function validPaymentUrl(mixed $url): bool
    {
        return is_string($url) && filter_var($url, FILTER_VALIDATE_URL)
            && parse_url($url, PHP_URL_SCHEME) === 'https'
            && ! parse_url($url, PHP_URL_USER) && ! parse_url($url, PHP_URL_PASS);
    }

    private function http(): PendingRequest
    {
        $baseUrl = rtrim((string) config('services.corefy.api_url'), '/');
        if (! $this->configured() || ! $this->validPaymentUrl($baseUrl)) {
            throw new RuntimeException('Corefy configuration is incomplete.');
        }

        return Http::baseUrl($baseUrl)
            ->withBasicAuth(config('services.corefy.account_id'), config('services.corefy.api_key'))
            ->accept('application/vnd.api+json')->contentType('application/vnd.api+json')
            ->connectTimeout(5)->timeout(25)->withoutRedirecting();
    }

    /** @param array<string, mixed> $payload
     * @param  array<string, mixed>  $context
     * @return array<string, mixed>
     */
    private function request(string $method, string $path, array $payload = [], array $context = []): array
    {
        $http = $this->http();
        $context += [
            'request_id' => (string) Str::uuid(), 'method' => $method,
            'path' => rtrim(parse_url(config('services.corefy.api_url'), PHP_URL_PATH) ?? '', '/').$path,
            'api_host' => parse_url(config('services.corefy.api_url'), PHP_URL_HOST),
        ];
        $this->logger->record('api.request', $context + ['payload' => $payload]);
        $startedAt = hrtime(true);
        try {
            $response = $method === 'POST' ? $http->post($path, $payload) : $http->get($path);
        } catch (ConnectionException) {
            $this->logger->record('api.connection_failed', $context + ['duration_ms' => round((hrtime(true) - $startedAt) / 1000000, 2)], 'warning');
            throw new RuntimeException('Corefy connection failed.');
        }
        $body = $response->json();
        $this->logger->record('api.response', $context + [
            'http_status' => $response->status(),
            'provider_request_id' => $response->header('X-Request-ID') ?: $response->header('X-Correlation-ID'),
            'duration_ms' => round((hrtime(true) - $startedAt) / 1000000, 2),
            'payload' => is_array($body) ? $body : [
                'format' => 'non-json', 'bytes' => strlen($response->body()),
                'sha256' => hash('sha256', $response->body()),
            ],
        ], $response->successful() ? 'info' : 'warning');
        if (! $response->successful() || ! is_array($response->json('data'))) {
            throw new RuntimeException('Corefy returned an invalid response (HTTP '.$response->status().').');
        }

        return $response->json('data');
    }
}
