<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\InvoiceService;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function download(Transaction $transaction, Request $request, InvoiceService $invoiceService)
    {
        if ($transaction->user_id !== $request->user()->id) {
            abort(403);
        }

        return $invoiceService->downloadResponse($transaction);
    }
}
