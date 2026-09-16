<?php

namespace Tests\Feature;

use App\Models\Upgrade;
use App\Models\User;
use App\Models\Vehicle;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GarageAndShopTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_user_can_purchase_vehicle_from_shop(): void
    {
        $user = User::first();
        $user->update(['game_balance' => 5000.00]);

        $carToBuy = Vehicle::where('price', '>', 0)->first();

        $response = $this->actingAs($user)->post("/shop/vehicle/{$carToBuy->id}/buy");
        $response->assertSessionHas('success');

        $user->refresh();
        $this->assertEquals(5000.00 - $carToBuy->price, $user->game_balance);

        $this->assertDatabaseHas('user_vehicles', [
            'user_id' => $user->id,
            'vehicle_id' => $carToBuy->id,
        ]);
    }

    public function test_user_can_install_performance_upgrade(): void
    {
        $user = User::first();
        $user->update(['game_balance' => 3000.00]);

        $userCar = $user->userVehicles()->first();
        $initialSpeed = $userCar->current_speed;

        $installedIds = $userCar->upgrades()->pluck('upgrades.id')->toArray();
        $upgrade = Upgrade::whereNotIn('id', $installedIds)->where('speed_bonus', '>', 0)->first();

        $response = $this->actingAs($user)->post("/garage/{$userCar->id}/upgrade", [
            'upgrade_id' => $upgrade->id,
        ]);

        $response->assertSessionHas('success');

        $userCar->refresh();
        $this->assertEquals($initialSpeed + $upgrade->speed_bonus, $userCar->current_speed);
        $this->assertEquals(3000.00 - $upgrade->price, $user->fresh()->game_balance);
    }
}
