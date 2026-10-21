<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'transaction_ref',
        'gateway',
        'fiat_amount',
        'currency',
        'game_credits',
        'status',
        'invoice_number',
        'invoice_path',
        'customer_snapshot',
        'gateway_response',
        'provider_invoice_id',
        'payment_url',
        'payment_requested_at',
        'receipt_queued_at',
        'credits_reversed_at',
        'completed_at',
    ];

    protected $hidden = ['gateway_response', 'payment_url'];

    protected function casts(): array
    {
        return [
            'fiat_amount' => 'decimal:2',
            'game_credits' => 'decimal:2',
            'customer_snapshot' => 'array',
            'gateway_response' => 'array',
            'completed_at' => 'datetime',
            'payment_requested_at' => 'datetime',
            'receipt_queued_at' => 'datetime',
            'credits_reversed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
