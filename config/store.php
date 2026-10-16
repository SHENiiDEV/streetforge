<?php

return [
    'locales' => ['en' => 'English', 'nb' => 'Norsk', 'sv' => 'Svenska'],
    /** Fixed minor currency units per 1 USD; no live exchange-rate lookup. */
    'currencies' => [
        'USD' => ['rate' => 100, 'symbol' => '$'],
        'EUR' => ['rate' => 92, 'symbol' => '€'],
        'GBP' => ['rate' => 79, 'symbol' => '£'],
    ],
];
