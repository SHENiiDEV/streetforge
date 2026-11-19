<?php

return [
    'default_currency' => 'EUR',
    'enabled_currencies' => ['EUR'],
    'pricing' => ['price_percent' => 120, 'minimum_custom_credits' => 951],
    'locales' => ['en' => 'English', 'nb' => 'Norsk', 'sv' => 'Svenska'],
    /** Fixed minor currency units per 1 USD; no live exchange-rate lookup. */
    'currencies' => [
        'USD' => ['rate' => 100, 'symbol' => '$'],
        'EUR' => ['rate' => 92, 'symbol' => '€'],
        'GBP' => ['rate' => 79, 'symbol' => '£'],
    ],
];
