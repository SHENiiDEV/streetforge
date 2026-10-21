<?php

namespace App\Services;

class CurrencyService
{
    public function selected(): string
    {
        $default = config('store.default_currency');
        $currency = session('currency', request()->cookie('site_currency', $default));

        return in_array($currency, config('store.enabled_currencies'), true) ? $currency : $default;
    }

    public function fromUsdCents(int $cents, string $currency): string
    {
        $rate = config('store.currencies.'.$currency.'.rate');
        $convertedCents = intdiv($cents * $rate + 50, 100);

        return sprintf('%d.%02d', intdiv($convertedCents, 100), $convertedCents % 100);
    }
}
