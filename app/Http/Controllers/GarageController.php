<?php

namespace App\Http\Controllers;

use App\Models\Skin;
use App\Models\Upgrade;
use App\Models\UserVehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GarageController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $userVehicles = UserVehicle::where('user_id', $user->id)
            ->with(['vehicle.skins', 'skin', 'upgrades'])
            ->get();

        $activeVehicle = $userVehicles->firstWhere('is_active', true) ?? $userVehicles->first();

        $availableUpgrades = Upgrade::all();
        $ownedSkinIds = $user->ownedSkins()->pluck('skins.id')->toArray();

        return Inertia::render('Garage/Index', [
            'userVehicles' => $userVehicles,
            'activeVehicleId' => $activeVehicle?->id,
            'availableUpgrades' => $availableUpgrades,
            'ownedSkinIds' => $ownedSkinIds,
        ]);
    }

    public function setActive(Request $request, UserVehicle $userVehicle): RedirectResponse
    {
        if ($userVehicle->user_id !== $request->user()->id) {
            abort(403);
        }

        UserVehicle::where('user_id', $request->user()->id)->update(['is_active' => false]);
        $userVehicle->update(['is_active' => true]);

        return back()->with('success', 'Active racing vehicle switched to ' . $userVehicle->vehicle->name);
    }

    public function installUpgrade(Request $request, UserVehicle $userVehicle): RedirectResponse
    {
        if ($userVehicle->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'upgrade_id' => ['required', 'exists:upgrades,id'],
        ]);

        $upgrade = Upgrade::findOrFail($validated['upgrade_id']);

        // Check if already installed
        if ($userVehicle->upgrades()->where('upgrade_id', $upgrade->id)->exists()) {
            return back()->with('error', 'This upgrade is already installed on this vehicle.');
        }

        $user = $request->user();
        if ($user->game_balance < $upgrade->price) {
            return back()->with('error', 'Insufficient credits. You need ' . number_format($upgrade->price - $user->game_balance) . ' more CR.');
        }

        // Deduct price and attach
        $user->decrement('game_balance', $upgrade->price);
        $userVehicle->upgrades()->attach($upgrade->id, ['user_id' => $user->id]);
        $userVehicle->recalculateStats();

        return back()->with('success', 'Successfully purchased and installed ' . $upgrade->name . '!');
    }

    public function applySkin(Request $request, UserVehicle $userVehicle): RedirectResponse
    {
        if ($userVehicle->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'skin_id' => ['required', 'exists:skins,id'],
        ]);

        $skin = Skin::findOrFail($validated['skin_id']);
        $user = $request->user();

        // Check if user owns the skin or if it's free
        $ownsSkin = $user->ownedSkins()->where('skin_id', $skin->id)->exists() || $skin->price <= 0;

        if (!$ownsSkin) {
            if ($user->game_balance < $skin->price) {
                return back()->with('error', 'Insufficient credits for this custom livery.');
            }
            $user->decrement('game_balance', $skin->price);
            $user->ownedSkins()->syncWithoutDetaching([$skin->id]);
        }

        $userVehicle->update(['skin_id' => $skin->id]);

        return back()->with('success', 'Applied livery ' . $skin->name . ' to your car!');
    }
}
