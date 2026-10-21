<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Throwable;

class CorefyLogger
{
    private const CONTAINERS = ['payload', 'data', 'attributes', 'metadata', 'customer', 'address', 'errors', 'flow_data', 'return_urls', 'source', 'included', 'relationships', 'processing_details', 'transaction_details', 'processing_status'];

    private const VALUES = [
        'request_id', 'provider_request_id', 'transaction_ref', 'provider_invoice_id', 'method', 'api_host', 'path',
        'http_status', 'duration_ms', 'signature_present', 'signature_valid', 'bytes', 'sha256', 'format',
        'id', 'type', 'reference_id', 'amount', 'processed_amount', 'payment_amount', 'currency',
        'service', 'flow', 'test_mode', 'status', 'resolution', 'resolution_message', 'code', 'title', 'detail', 'message',
        'error_code', 'error_message', 'description', 'provider_reference_id', 'original_id', 'source',
        'reason', 'pointer', 'parameter', 'transaction_status', 'country',
        'callback_url', 'return_url', 'success', 'pending', 'fail', 'action', 'hpp_url',
    ];

    /** @var list<string> */
    private array $privateValues = [];

    /** @param array<string, mixed> $context */
    public function record(string $event, array $context, string $level = 'info'): void
    {
        if (! config('services.corefy.log_enabled', true)) {
            return;
        }
        try {
            $this->collectPrivateValues($context);
            $context = $this->sanitize($context);
            Log::channel('corefy')->log($level, $event, $context);
        } catch (Throwable) {
            // A diagnostic sink failure must never interrupt a payment or its acknowledgement.
            error_log('Corefy diagnostic log could not be written.');
        }
    }

    /** @param array<array-key, mixed> $data */
    private function collectPrivateValues(array $data, bool $private = false): void
    {
        foreach ($data as $key => $value) {
            $sensitive = $private || in_array($key, ['customer', 'client', 'email', 'phone', 'name', 'first_name', 'surname', 'last_name', 'street', 'city', 'post_code', 'card_number', 'pan', 'authorization', 'token', 'secret'], true);
            if (is_array($value)) {
                $this->collectPrivateValues($value, $sensitive);
            } elseif ($sensitive && is_string($value) && strlen($value) >= 3 && ! in_array($key, ['reference_id', 'country'], true)) {
                $this->privateValues[] = $value;
            }
        }
    }

    /** @param array<array-key, mixed> $data
     * @return array<array-key, mixed>
     */
    private function sanitize(array $data, int $depth = 0): array
    {
        if ($depth > 10) {
            return ['truncated' => true];
        }
        $result = [];
        foreach (array_slice($data, 0, 50, true) as $key => $value) {
            if (is_int($key)) {
                $result[$key] = is_array($value) ? $this->sanitize($value, $depth + 1) : '[REDACTED]';
            } elseif (in_array($key, self::CONTAINERS, true) && is_array($value)) {
                $result[$key] = $this->sanitize($value, $depth + 1);
            } elseif (in_array($key, self::VALUES, true) && ! is_array($value) && ! is_object($value)) {
                if (in_array($key, ['callback_url', 'return_url', 'success', 'pending', 'fail', 'action', 'hpp_url'], true) && is_string($value)) {
                    $result[$key] = '[URL REDACTED]';
                } elseif ($key === 'country' && (! is_string($value) || ! preg_match('/^[A-Z]{2}$/D', $value))) {
                    $result[$key] = '[REDACTED]';
                } else {
                    $result[$key] = is_string($value) ? $this->text($value) : $value;
                }
            } else {
                $result[$key] = '[REDACTED]';
            }
        }
        if (count($data) > 50) {
            $result['truncated'] = true;
        }

        return $result;
    }

    private function text(string $value): string
    {
        $secrets = array_filter([
            config('services.corefy.account_id'), config('services.corefy.api_key'),
            config('services.corefy.webhook_secret'),
            base64_encode(config('services.corefy.account_id').':'.config('services.corefy.api_key')),
            ...$this->privateValues,
        ], fn (mixed $secret): bool => is_string($secret) && strlen($secret) >= 3);
        $value = str_replace($secrets, '[REDACTED]', $value);
        $value = preg_replace('/\b(?:Basic|Bearer)\s+[A-Za-z0-9+\/_.=\-]+/i', '[AUTH REDACTED]', $value);
        $value = preg_replace('/\b(?:cvv|cvc|csc|card_number|pan|password|secret|token|signature)\s*[:=]\s*[^\s,;]+/i', '[SENSITIVE VALUE REDACTED]', $value);
        $value = preg_replace('~https?://[^\s<>"\x27]+~i', '[URL REDACTED]', $value);
        $value = preg_replace('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', '[EMAIL REDACTED]', $value);
        $value = preg_replace('/(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)/', '[NUMBER REDACTED]', $value);
        $value = preg_replace('/\+\d[\d ()-]{6,}\d/', '[PHONE REDACTED]', $value);

        return mb_substr(str_replace(["\r", "\n"], ' ', $value), 0, 1500);
    }
}
