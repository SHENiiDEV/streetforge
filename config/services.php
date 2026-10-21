<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'corefy' => [
        'log_enabled' => env('COREFY_LOG_ENABLED', true),
        'api_url' => env('COREFY_API_URL', 'https://api.sterling-pay.com'),
        'account_id' => env('COREFY_ACCOUNT_ID'),
        'api_key' => env('COREFY_API_KEY'),
        'webhook_secret' => env('COREFY_WEBHOOK_SECRET'),
        'service_code' => env('COREFY_SERVICE_CODE', 'auto'),
        'signature_algorithm' => env('COREFY_SIGNATURE_ALGORITHM', 'corefy'),
    ],

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
