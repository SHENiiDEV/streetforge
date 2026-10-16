<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SitePreferencesController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'locale' => ['sometimes', 'required', 'string', Rule::in(array_keys(config('store.locales')))],
            'currency' => ['sometimes', 'required', 'string', Rule::in(array_keys(config('store.currencies')))],
        ]);

        $request->session()->put($validated);

        $response = back();
        foreach ($validated as $key => $value) {
            $response->withCookie(cookie('site_'.$key, $value, 525600));
        }

        return $response;
    }
}
