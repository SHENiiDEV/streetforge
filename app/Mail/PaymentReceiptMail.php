<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class PaymentReceiptMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Transaction $transaction) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Receipt for your StreetForge Top-Up ('.$this->transaction->invoice_number.')',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payment_receipt',
            with: [
                'transaction' => $this->transaction,
                'user' => $this->transaction->user,
                'company' => [
                    'name' => config('company.name'),
                    'number' => config('company.number'),
                    'address' => config('company.address'),
                    'email' => config('company.email'),
                ],
            ],
        );
    }

    public function attachments(): array
    {
        if ($this->transaction->invoice_path && Storage::disk('public')->exists($this->transaction->invoice_path)) {
            return [
                Attachment::fromStorageDisk('public', $this->transaction->invoice_path)
                    ->as('Invoice_'.$this->transaction->invoice_number.'.pdf')
                    ->withMime('application/pdf'),
            ];
        }

        return [];
    }
}
