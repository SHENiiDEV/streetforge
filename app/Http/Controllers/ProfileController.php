<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $countries = config('countries');
        $profile = $request->user()->only(['name', 'surname', 'email', 'phone', 'street', 'city', 'country', 'post_code']);
        $profile['country'] = array_search($profile['country'], $countries, true) ?: $profile['country'];
        $countryNames = array_keys($countries);
        sort($countryNames);

        return Inertia::render('Profile/Edit', [
            'profile' => $profile,
            'countries' => $countryNames,
            'updateUrl' => route('profile.update', absolute: false),
        ]);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->safe()->only(['name', 'surname', 'email', 'phone', 'street', 'city', 'country', 'post_code']));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return redirect()->route('profile.edit')->with('success', __('Profile updated.'));
    }
}
