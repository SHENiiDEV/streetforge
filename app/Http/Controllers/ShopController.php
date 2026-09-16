<?php

namespace App\Http\Controllers;

use App\Models\Skin;
use App\Models\Upgrade;
use App\Models\UserVehicle;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $vehicles = Vehicle::with('skins')->get();
        $ownedVehicleIds = UserVehicle::where('user_id', $user->id)->pluck('vehicle_id')->toArray();
        $ownedSkinIds = $user->ownedSkins()->pluck('skins.id')->toArray();
        $upgrades = Upgrade::all();

        return Inertia::render('Shop/Index', [
            'vehicles' => $vehicles,
            'ownedVehicleIds' => $ownedVehicleIds,
            'ownedSkinIds' => $ownedSkinIds,
            'upgrades' => $upgrades,
        ]);
    }

    public function buyVehicle(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $user = $request->user();

        if (UserVehicle::where('user_id', $user->id)->where('vehicle_id', $vehicle->id)->exists()) {
            return back()->with('error', 'You already own this vehicle in your garage.');
        }

        if ($user->game_balance < $vehicle->price) {
            return back()->with('error', 'Insufficient credits to purchase ' . $vehicle->name . '. You need ' . number_format($vehicle->price - $user->game_balance) . ' CR more.');
        }

        $user->decrement('game_balance', $vehicle->price);

        $defaultSkin = Skin::where('vehicle_id', $vehicle->id)->first();

        $userVehicle = UserVehicle::create([
            'user_id' => $user->id,
            'vehicle_id' => $vehicle->id,
            'skin_id' => $defaultSkin?->id,
            'current_speed' => $vehicle->base_speed,
            'current_handling' => $vehicle->base_handling,
            'current_acceleration' => $vehicle->base_acceleration,
            'current_nitro' => $vehicle->base_nitro,
            'is_active' => false,
        ]);

        if ($defaultSkin) {
            $user->ownedSkins()->syncWithoutDetaching([$defaultSkin->id]);
        }

        return back()->with('success', 'Congratulations! ' . $vehicle->name . ' has been added to your garage.');
    }

    public function buySkin(Request $request, Skin $skin): RedirectResponse
    {
        $user = $request->user();

        if ($user->ownedSkins()->where('skin_id', $skin->id)->exists()) {
            return back()->with('error', 'You already own this livery.');
        }

        if ($user->game_balance < $skin->price) {
            return back()->with('error', 'Insufficient credits to purchase this skin.');
        }

        $user->decrement('game_balance', $skin->price);
        $user->ownedSkins()->attach($skin->id);

        return back()->with('success', 'Custom livery ' . $skin->name . ' unlocked! You can apply it in your Garage.');
    }
}
