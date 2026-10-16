<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeUserMail;
use App\Models\Skin;
use App\Models\User;
use App\Models\UserVehicle;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'blacklistedCountries' => config('sanctions.blacklisted_countries', []),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $sanctionsList = array_merge(
            config('sanctions.blacklisted_countries', []),
            config('sanctions.blacklisted_aliases', [])
        );

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:filter', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'phone' => ['required', 'string', 'max:30'],
            'dob' => ['required', 'date', 'before:-16 years'],
            'street' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'country' => [
                'required',
                'string',
                'max:255',
                Rule::notIn($sanctionsList),
            ],
            'post_code' => ['required', 'string', 'max:20'],
            'terms' => ['accepted'],
        ], [
            'country.not_in' => __('Registration is strictly prohibited from your selected country due to international sanctions and regulatory compliance.'),
            'terms.accepted' => __('You must accept the Terms & Conditions and Privacy Policy to create a racer account.'),
            'dob.before' => __('You must be at least 16 years of age to register.'),
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'surname' => $validated['surname'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'dob' => $validated['dob'],
            'street' => $validated['street'],
            'city' => $validated['city'],
            'country' => $validated['country'],
            'post_code' => $validated['post_code'],
            'game_balance' => 1000.00, // Starter bonus
            'xp' => 0,
            'level' => 1,
            'avatar_color' => '#06b6d4',
            'password' => Hash::make($validated['password']),
        ]);

        // Provide default starter vehicle
        $starterVehicle = Vehicle::where('unlocked_by_default', true)->first() ?? Vehicle::first();
        if ($starterVehicle) {
            $starterSkin = Skin::where('vehicle_id', $starterVehicle->id)->first();
            $userCar = UserVehicle::create([
                'user_id' => $user->id,
                'vehicle_id' => $starterVehicle->id,
                'skin_id' => $starterSkin?->id,
                'current_speed' => $starterVehicle->base_speed,
                'current_handling' => $starterVehicle->base_handling,
                'current_acceleration' => $starterVehicle->base_acceleration,
                'current_nitro' => $starterVehicle->base_nitro,
                'is_active' => true,
            ]);

            if ($starterSkin) {
                $user->ownedSkins()->attach($starterSkin->id);
            }
        }

        try {
            Mail::to($user->email)->queue((new WelcomeUserMail($user))->locale(app()->getLocale()));
        } catch (\Throwable $e) {
            // Silently log or continue if mail server is not configured in local environment
        }

        Auth::login($user);

        return redirect()->route('garage.index')->with('success', __('Welcome to StreetForge! We credited your garage with your first vehicle and 1,000 Starter Credits.'));
    }
}
