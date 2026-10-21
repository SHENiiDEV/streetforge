<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table): void {
            $table->string('provider_invoice_id')->nullable()->unique();
            $table->text('payment_url')->nullable();
            $table->timestamp('payment_requested_at')->nullable();
            $table->timestamp('receipt_queued_at')->nullable();
            $table->timestamp('credits_reversed_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table): void {
            $table->dropUnique(['provider_invoice_id']);
            $table->dropColumn(['provider_invoice_id', 'payment_url', 'payment_requested_at', 'receipt_queued_at', 'credits_reversed_at']);
        });
    }
};
