<?php

namespace App\Http\Controllers;

use App\Models\RaceTrack;
use App\Models\Vehicle;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function landing(): Response
    {
        $featuredVehicles = Vehicle::with('skins')->get();
        $tracks = RaceTrack::orderBy('id')->get([
            'id', 'name', 'slug', 'theme', 'difficulty', 'laps',
            'length_meters', 'reward_currency_1st', 'description',
        ]);
        $tracksCount = $tracks->count();
        $totalRacers = 1420 + \App\Models\User::count();

        return Inertia::render('Landing', [
            'featuredVehicles' => $featuredVehicles,
            'tracks' => $tracks,
            'stats' => [
                'tracks' => $tracksCount ?: 3,
                'racers' => $totalRacers,
                'vehicles' => $featuredVehicles->count(),
                'prizePool' => '500,000 CR',
            ],
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('Legal/About');
    }

    public function howItWorks(): Response
    {
        return Inertia::render('Legal/HowItWorks');
    }

    public function faq(): Response
    {
        return Inertia::render('Legal/FAQ');
    }

    public function terms(): Response
    {
        return Inertia::render('Legal/Terms');
    }

    public function privacy(): Response
    {
        return Inertia::render('Legal/Privacy');
    }

    public function refunds(): Response
    {
        return Inertia::render('Legal/Refunds');
    }

    public function sanctionsPolicy(): Response
    {
        return Inertia::render('Legal/Sanctions');
    }

    public function cookiePolicy(): Response
    {
        return Inertia::render('Legal/CookiePolicy');
    }

    public function legalCentre(): Response
    {
        return Inertia::render('Legal/LegalCentre');
    }

    public function paymentSecurity(): Response
    {
        return Inertia::render('Legal/PaymentSecurity');
    }

    public function billingTerms(): Response
    {
        return Inertia::render('Legal/BillingTerms');
    }

    public function chargebackPolicy(): Response
    {
        return Inertia::render('Legal/ChargebackPolicy');
    }

    public function virtualCredits(): Response
    {
        return Inertia::render('Legal/VirtualCredits');
    }

    public function fairPlay(): Response
    {
        return Inertia::render('Legal/FairPlay');
    }

    public function responsiblePlay(): Response
    {
        return Inertia::render('Legal/ResponsiblePlay');
    }

    public function complaints(): Response
    {
        return Inertia::render('Legal/Complaints');
    }

    public function security(): Response
    {
        return Inertia::render('Legal/Security');
    }

    public function accessibility(): Response
    {
        return Inertia::render('Legal/Accessibility');
    }

    public function intellectualProperty(): Response
    {
        return Inertia::render('Legal/IntellectualProperty');
    }

    public function contact(): Response
    {
        return Inertia::render('Legal/Contact');
    }
}
