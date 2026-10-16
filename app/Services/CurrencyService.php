<?php

namespace App\Services;

class CurrencyService
{
    public function selected(): string
    {
        $currency = session('currency', request()->cookie('site_currency', 'USD'));

        return array_key_exists($currency, config('store.currencies')) ? $currency : 'USD';
    }

    public function fromUsdCents(int $cents, string $currency): string
    {
        $rate = config('store.currencies.'.$currency.'.rate');
        $convertedCents = intdiv($cents * $rate + 50, 100);

        return sprintf('%d.%02d', intdiv($convertedCents, 100), $convertedCents % 100);
    }
}
