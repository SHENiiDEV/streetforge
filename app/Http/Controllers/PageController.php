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
        $tracksCount = RaceTrack::count();
        $totalRacers = 1420 + \App\Models\User::count();

        return Inertia::render('Landing', [
            'featuredVehicles' => $featuredVehicles,
            'stats' => [
                'tracks' => $tracksCount ?: 3,
                'racers' => $totalRacers,
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
}
