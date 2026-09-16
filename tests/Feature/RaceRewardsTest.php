<?php

namespace Tests\Feature;

use App\Models\RaceTrack;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RaceRewardsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_user_earns_currency_and_xp_after_race_submission(): void
    {
        $user = User::first();
        $initialBalance = $user->game_balance;
        $initialXp = $user->xp;

        $track = RaceTrack::first();

        $response = $this->actingAs($user)->postJson("/race/{$track->id}/submit", [
            'position' => 1,
            'race_time_seconds' => 45.32,
            'best_lap_seconds' => 22.50,
            'user_vehicle_id' => $user->activeVehicle?->id,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'rewards' => [
                'currency' => (float) $track->reward_currency_1st,
                'xp' => (int) $track->reward_xp_1st,
            ],
        ]);

        $user->refresh();
        $this->assertEquals($initialBalance + $track->reward_currency_1st, $user->game_balance);
        $this->assertEquals($initialXp + $track->reward_xp_1st, $user->xp);

        $this->assertDatabaseHas('race_results', [
            'user_id' => $user->id,
            'race_track_id' => $track->id,
            'position' => 1,
        ]);
    }
}
