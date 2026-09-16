<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $transaction->invoice_number ?? $transaction->transaction_ref }}</title>
    <style>
        @page {
            margin: 0;
            size: A4 portrait;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 40px 48px;
            color: #1e293b;
            background-color: #ffffff;
            font-size: 13px;
            line-height: 1.5;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .logo-text {
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #0f172a;
            text-transform: uppercase;
        }
        .logo-text span {
            color: #06b6d4;
        }
        .invoice-badge {
            display: inline-block;
            background-color: #0f172a;
            color: #ffffff;
            padding: 6px 14px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .paid-stamp {
            display: inline-block;
            margin-top: 6px;
            background-color: #ecfdf5;
            color: #059669;
            border: 1px solid #10b981;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .divider {
            height: 2px;
            background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #e2e8f0 100%);
            margin: 20px 0 30px 0;
            border: none;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 35px;
        }
        .info-table td {
            vertical-align: top;
            width: 50%;
        }
        .section-title {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 8px;
        }
        .entity-name {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
        }
        .entity-text {
            font-size: 12px;
            color: #475569;
            margin-bottom: 3px;
        }
        .meta-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .meta-table td {
            padding: 4px 0;
            font-size: 12px;
        }
        .meta-label {
            color: #64748b;
            width: 40%;
        }
        .meta-value {
            font-weight: 600;
            color: #0f172a;
            text-align: right;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background-color: #f8fafc;
            color: #475569;
            text-transform: uppercase;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
            padding: 12px 14px;
            text-align: left;
            border-top: 1px solid #e2e8f0;
            border-bottom: 1px solid #cbd5e1;
        }
        .items-table td {
            padding: 14px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            font-size: 13px;
        }
        .items-table tr:last-child td {
            border-bottom: 2px solid #cbd5e1;
        }
        .summary-table {
            width: 45%;
            margin-left: auto;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .summary-table td {
            padding: 6px 12px;
            font-size: 13px;
        }
        .summary-table .total-row td {
            padding-top: 12px;
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
            border-top: 2px solid #0f172a;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
            text-align: center;
        }
        .footer p {
            margin: 3px 0;
        }
    </style>
</head>
<body>

    <!-- Header Table -->
    <table class="header-table">
        <tr>
            <td style="vertical-align: top;">
                <div class="logo-text">STREET<span>FORGE</span></div>
                <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-top: 2px;">
                    Digital Motorsport & Dyno Tuning
                </div>
            </td>
            <td style="vertical-align: top; text-align: right;">
                <div class="invoice-badge">TAX INVOICE</div>
                <div>
                    <span class="paid-stamp">&#10003; PAYMENT COMPLETED</span>
                </div>
            </td>
        </tr>
    </table>

    <hr class="divider">

    <!-- Meta Details & Addresses -->
    <table class="info-table">
        <tr>
            <!-- Seller details (from .env / config) -->
            <td style="padding-right: 30px;">
                <div class="section-title">ISSUED BY (MERCHANT)</div>
                <div class="entity-name">{{ $company['name'] }}</div>
                <div class="entity-text"><strong>Reg No:</strong> {{ $company['number'] }}</div>
                <div class="entity-text">{{ $company['address'] }}</div>
                <div class="entity-text"><strong>Email:</strong> {{ $company['email'] }}</div>
                <div class="entity-text"><strong>Web:</strong> {{ config('app.url') }}</div>
            </td>

            <!-- Buyer details -->
            <td style="padding-left: 20px;">
                <div class="section-title">BILLED TO (CUSTOMER)</div>
                <div class="entity-name">{{ $customer['name'] ?? 'Racer Account' }}</div>
                @if(!empty($customer['street']))
                    <div class="entity-text">{{ $customer['street'] }}</div>
                @endif
                @if(!empty($customer['city']) || !empty($customer['post_code']))
                    <div class="entity-text">{{ $customer['city'] ?? '' }} {{ $customer['post_code'] ?? '' }}</div>
                @endif
                <div class="entity-text"><strong>Country:</strong> {{ $customer['country'] ?? 'International' }}</div>
                <div class="entity-text"><strong>Email:</strong> {{ $customer['email'] ?? '-' }}</div>
                @if(!empty($customer['phone']))
                    <div class="entity-text"><strong>Phone:</strong> {{ $customer['phone'] }}</div>
                @endif
            </td>
        </tr>
    </table>

    <!-- Invoice Attributes -->
    <table style="width: 100%; margin-bottom: 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 18px;">
        <tr>
            <td style="width: 25%;">
                <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Invoice Number</div>
                <div style="font-size: 13px; font-weight: 700; color: #0f172a;">{{ $transaction->invoice_number ?? 'INV-'.$transaction->id }}</div>
            </td>
            <td style="width: 25%;">
                <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Issue Date</div>
                <div style="font-size: 13px; font-weight: 700; color: #0f172a;">{{ ($transaction->completed_at ?? $transaction->created_at)->format('d M Y, H:i') }} UTC</div>
            </td>
            <td style="width: 25%;">
                <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Payment Method</div>
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: capitalize;">{{ str_replace('_', ' ', $transaction->gateway) }}</div>
            </td>
            <td style="width: 25%; text-align: right;">
                <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Transaction ID</div>
                <div style="font-size: 13px; font-weight: 700; color: #0f172a;">{{ $transaction->transaction_ref }}</div>
            </td>
        </tr>
    </table>

    <!-- Line Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 50%;">Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Credits</th>
                <th style="width: 20%; text-align: right;">Amount ({{ $transaction->currency }})</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div style="font-weight: 700; color: #0f172a;">StreetForge Digital Credits Top-Up</div>
                    <div style="font-size: 11px; color: #64748b;">In-game virtual currency package for upgrades, parts, and vehicles.</div>
                </td>
                <td style="text-align: center; font-weight: 600;">1</td>
                <td style="text-align: right; font-weight: 600; color: #0891b2;">+{{ number_format($transaction->game_credits, 0) }} CR</td>
                <td style="text-align: right; font-weight: 700; color: #0f172a;">${{ number_format($transaction->fiat_amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <!-- Totals Summary -->
    <table class="summary-table">
        <tr>
            <td style="color: #64748b;">Subtotal:</td>
            <td style="text-align: right; font-weight: 600;">${{ number_format($transaction->fiat_amount, 2) }}</td>
        </tr>
        <tr>
            <td style="color: #64748b;">VAT / Sales Tax (0%):</td>
            <td style="text-align: right; font-weight: 600;">$0.00</td>
        </tr>
        <tr class="total-row">
            <td>Total Paid:</td>
            <td style="text-align: right; color: #0891b2;">${{ number_format($transaction->fiat_amount, 2) }} {{ $transaction->currency }}</td>
        </tr>
    </table>

    <!-- Footer with legal text -->
    <div class="footer">
        <p>Thank you for playing StreetForge. This document is a computer-generated tax invoice and receipt of payment.</p>
        <p>{{ $company['name'] }} &bull; Reg: {{ $company['number'] }} &bull; {{ $company['address'] }} &bull; Contact: {{ $company['email'] }}</p>
    </div>

</body>
</html>
