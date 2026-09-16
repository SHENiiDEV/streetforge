<?php

namespace App\Services;

use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    /**
     * Generate and save PDF invoice for a transaction.
     */
    public function generate(Transaction $transaction): string
    {
        $company = [
            'name' => config('company.name', 'Apex Racing Ltd'),
            'number' => config('company.number', 'HE-428910'),
            'address' => config('company.address', '14 Spyrou Kyprianou Ave, Silver House, 3070 Limassol, Cyprus'),
            'email' => config('company.email', 'support@apexracing.game'),
        ];

        $customer = $transaction->customer_snapshot ?? [
            'name' => $transaction->user?->full_name,
            'email' => $transaction->user?->email,
            'phone' => $transaction->user?->phone,
            'street' => $transaction->user?->street,
            'city' => $transaction->user?->city,
            'country' => $transaction->user?->country,
            'post_code' => $transaction->user?->post_code,
        ];

        $pdf = Pdf::loadView('invoices.pdf', [
            'transaction' => $transaction,
            'company' => $company,
            'customer' => $customer,
        ])->setPaper('a4', 'portrait');

        $fileName = 'invoices/invoice_' . ($transaction->invoice_number ?: $transaction->id) . '.pdf';
        
        Storage::disk('public')->put($fileName, $pdf->output());

        $transaction->update([
            'invoice_path' => $fileName,
        ]);

        return $fileName;
    }

    /**
     * Stream or download PDF.
     */
    public function downloadResponse(Transaction $transaction)
    {
        $company = [
            'name' => config('company.name', 'Apex Racing Ltd'),
            'number' => config('company.number', 'HE-428910'),
            'address' => config('company.address', '14 Spyrou Kyprianou Ave, Silver House, 3070 Limassol, Cyprus'),
            'email' => config('company.email', 'support@apexracing.game'),
        ];

        $customer = $transaction->customer_snapshot ?? [
            'name' => $transaction->user?->full_name,
            'email' => $transaction->user?->email,
            'phone' => $transaction->user?->phone,
            'street' => $transaction->user?->street,
            'city' => $transaction->user?->city,
            'country' => $transaction->user?->country,
            'post_code' => $transaction->user?->post_code,
        ];

        $pdf = Pdf::loadView('invoices.pdf', [
            'transaction' => $transaction,
            'company' => $company,
            'customer' => $customer,
        ])->setPaper('a4', 'portrait');

        $filename = 'ApexRacing_Invoice_' . ($transaction->invoice_number ?: $transaction->transaction_ref) . '.pdf';

        return $pdf->download($filename);
    }
}
