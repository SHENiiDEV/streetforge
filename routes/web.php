<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\GarageController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\RaceController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\TopupController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NewsController;
use App\Http\Controllers\LeaderboardController;

/*
|--------------------------------------------------------------------------
| Web Routes - StreetForge
|--------------------------------------------------------------------------
*/

// Public & Information Pages
Route::get('/', [PageController::class, 'landing'])->name('landing');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/how-it-works', [PageController::class, 'howItWorks'])->name('how-it-works');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');
Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/refund-policy', [PageController::class, 'refunds'])->name('refunds');
Route::get('/aml-sanctions', [PageController::class, 'sanctionsPolicy'])->name('sanctions.policy');
Route::get('/cookie-policy', [PageController::class, 'cookiePolicy'])->name('cookie-policy');

// Extended legal & static pages (rendered from the shared Legal Centre registry)
Route::get('/legal', [PageController::class, 'legalCentre'])->name('legal');
Route::get('/payment-security', [PageController::class, 'paymentSecurity'])->name('payment-security');
Route::get('/billing-terms', [PageController::class, 'billingTerms'])->name('billing-terms');
Route::get('/chargeback-policy', [PageController::class, 'chargebackPolicy'])->name('chargeback-policy');
Route::get('/virtual-credits', [PageController::class, 'virtualCredits'])->name('virtual-credits');
Route::get('/fair-play', [PageController::class, 'fairPlay'])->name('fair-play');
Route::get('/responsible-play', [PageController::class, 'responsiblePlay'])->name('responsible-play');
Route::get('/complaints', [PageController::class, 'complaints'])->name('complaints');
Route::get('/security', [PageController::class, 'security'])->name('security');
Route::get('/accessibility', [PageController::class, 'accessibility'])->name('accessibility');
Route::get('/intellectual-property', [PageController::class, 'intellectualProperty'])->name('intellectual-property');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');

// Global Seasonal Leaderboard (500+ Participants & Hall of Fame)
Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');

// News & Articles
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{slug}', [NewsController::class, 'show'])->name('news.show');

// Guest Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// Authenticated Game Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Garage & Tuning
    Route::get('/garage', [GarageController::class, 'index'])->name('garage.index');
    Route::post('/garage/{userVehicle}/set-active', [GarageController::class, 'setActive'])->name('garage.set-active');
    Route::post('/garage/{userVehicle}/upgrade', [GarageController::class, 'installUpgrade'])->name('garage.upgrade');
    Route::post('/garage/{userVehicle}/skin', [GarageController::class, 'applySkin'])->name('garage.skin');

    // Shop
    Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
    Route::post('/shop/vehicle/{vehicle}/buy', [ShopController::class, 'buyVehicle'])->name('shop.buy-vehicle');
    Route::post('/shop/skin/{skin}/buy', [ShopController::class, 'buySkin'])->name('shop.buy-skin');

    // Top-Up & Transactions
    Route::get('/topup', [TopupController::class, 'index'])->name('topup.index');
    Route::post('/topup/order', [TopupController::class, 'createOrder'])->name('topup.order');
    Route::get('/topup/checkout/{transaction:transaction_ref}', [TopupController::class, 'checkout'])->name('topup.checkout');
    Route::post('/topup/checkout/{transaction:transaction_ref}/pay', [TopupController::class, 'processMockPayment'])->name('topup.process');

    // Invoices
    Route::get('/invoices/{transaction:invoice_number}/download', [InvoiceController::class, 'download'])->name('invoices.download');

    // Race & Lobby
    Route::get('/race/lobby', [RaceController::class, 'lobby'])->name('race.lobby');
    Route::post('/race/{track}/submit', [RaceController::class, 'submitResult'])->name('race.submit');
});

// Webhook (Publicly accessible with signature verification)
Route::post('/topup/webhook', [TopupController::class, 'handleWebhook'])->name('topup.webhook');
