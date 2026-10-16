<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <title>{{ __('Payment Receipt') }}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 8px; padding: 32px; border: 1px solid #334155;">
        <h1 style="color: #06b6d4; margin-top: 0;">STREETFORGE</h1>
        <h2>{{ __('Payment Confirmation & Invoice') }}</h2>
        <p>{{ __('Dear :name,', ['name' => $user->name]) }}</p>
        <p>{{ __('Your balance top-up has been successfully processed!') }}</p>
        
        <div style="background-color: #0f172a; border-radius: 6px; padding: 16px; margin: 20px 0; border: 1px solid #334155;">
            <p style="margin: 4px 0;"><strong>{{ __('Invoice #:') }}</strong> {{ $transaction->invoice_number }}</p>
            <p style="margin: 4px 0;"><strong>{{ __('Amount Paid:') }}</strong> {{ config('store.currencies.'.$transaction->currency.'.symbol', $transaction->currency) }}{{ number_format($transaction->fiat_amount, 2) }} {{ $transaction->currency }}</p>
            <p style="margin: 4px 0;"><strong>{{ __('Credits Added:') }}</strong> +{{ number_format($transaction->game_credits, 0) }} CR</p>
            <p style="margin: 4px 0;"><strong>{{ __('New Balance:') }}</strong> {{ number_format($user->game_balance, 0) }} CR</p>
        </div>

        <p>{{ __('Your official PDF invoice is attached to this email.') }}</p>
        
        <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            {{ $company['name'] }} &bull; Reg: {{ $company['number'] }}<br>
            {{ $company['address'] }}<br>
            {{ __('Support:') }} {{ $company['email'] }}
        </p>
    </div>
</body>
</html>
