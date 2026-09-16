<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user) {
            $user->loadMissing(['activeVehicle.vehicle', 'activeVehicle.skin', 'activeVehicle.upgrades']);
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'dob' => $user->dob ? $user->dob->format('Y-m-d') : null,
                    'street' => $user->street,
                    'city' => $user->city,
                    'country' => $user->country,
                    'post_code' => $user->post_code,
                    'game_balance' => (float) $user->game_balance,
                    'xp' => (int) $user->xp,
                    'level' => (int) $user->level,
                    'avatar_color' => $user->avatar_color,
                    'active_vehicle' => $user->activeVehicle,
                ] : null,
            ],
            'company' => [
                'name' => config('company.name'),
                'number' => config('company.number'),
                'address' => config('company.address'),
                'email' => config('company.email'),
            ],
            'sanctions' => [
                'blacklisted_countries' => config('sanctions.blacklisted_countries', []),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
        ]);
    }
}
