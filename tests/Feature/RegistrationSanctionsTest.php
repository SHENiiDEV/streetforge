<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationSanctionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_user_cannot_register_from_blacklisted_sanctioned_countries(): void
    {
        $blacklisted = [
            'Russia',
            'Iran',
            'North Korea',
            'Belarus',
            'Syria',
            'Cuba',
            'Venezuela',
            'Sudan',
        ];

        foreach ($blacklisted as $country) {
            $response = $this->post('/register', [
                'name' => 'John',
                'surname' => 'Doe',
                'email' => 'test_' . strtolower(str_replace(' ', '', $country)) . '@example.com',
                'password' => 'SecurePass123!',
                'password_confirmation' => 'SecurePass123!',
                'phone' => '+1234567890',
                'dob' => '1995-01-01',
                'street' => 'Sample Street 1',
                'city' => 'Sample City',
                'country' => $country,
                'post_code' => '10001',
                'terms' => true,
            ]);

            $response->assertSessionHasErrors(['country']);
        }
    }

    public function test_user_can_register_from_allowed_country_and_receives_starter_pack(): void
    {
        $response = $this->post('/register', [
            'name' => 'Michael',
            'surname' => 'Schumacher',
            'email' => 'michael@streetforge.co.uk',
            'password' => 'SpeedKing2026!',
            'password_confirmation' => 'SpeedKing2026!',
            'phone' => '+49 170 1234567',
            'dob' => '1990-01-03',
            'street' => 'Kerpen Ring 1',
            'city' => 'Kerpen',
            'country' => 'Germany',
            'post_code' => '50171',
            'terms' => true,
        ]);

        $response->assertRedirect('/garage');
        $this->assertAuthenticated();

        $user = User::where('email', 'michael@streetforge.co.uk')->first();
        $this->assertNotNull($user);
        $this->assertEquals(1000.00, $user->game_balance);

        // Verify starter vehicle
        $this->assertCount(1, $user->userVehicles);
        $this->assertTrue($user->userVehicles->first()->is_active);
    }
}
