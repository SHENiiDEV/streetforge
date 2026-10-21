<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    /** @return array<string, string> */
    private function profileData(string $email): array
    {
        return [
            'name' => 'Alex', 'surname' => 'Rider', 'email' => $email,
            'phone' => '+47 12345678', 'street' => 'Storgata 12',
            'city' => 'Oslo', 'country' => 'Norway', 'post_code' => '0155',
        ];
    }

    public function test_guests_cannot_view_or_update_profiles(): void
    {
        $this->get(route('profile.edit'))->assertRedirect(route('login'));
        $this->patch(route('profile.update'), [])->assertRedirect(route('login'));
    }

    public function test_profile_shows_own_details_and_normalizes_existing_iso_country(): void
    {
        $user = User::factory()->create(['country' => 'NO']);
        $this->actingAs($user)->get(route('profile.edit'))->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profile/Edit')->where('profile.email', $user->email)
                ->where('profile.country', 'Norway')->where('updateUrl', '/profile')
                ->has('countries', 36)->missing('profile.password')->missing('profile.remember_token'));
    }

    public function test_only_own_personal_and_billing_fields_are_updated(): void
    {
        $user = User::factory()->create(['name' => 'Old', 'game_balance' => 123, 'xp' => 10, 'level' => 2]);
        $other = User::factory()->create(['name' => 'Other']);
        $verifiedAt = $user->email_verified_at->toDateTimeString();
        $password = $user->password;
        $data = $this->profileData($user->email);

        $this->actingAs($user)->patch(route('profile.update'), $data + [
            'id' => $other->id, 'user_id' => $other->id, 'game_balance' => 999999,
            'xp' => 999999, 'level' => 100, 'password' => 'changed',
            'email_verified_at' => null, 'dob' => '2000-01-01',
        ])->assertRedirect(route('profile.edit'))->assertSessionHasNoErrors()
            ->assertSessionHas('success', 'Profile updated.');

        $this->assertDatabaseHas('users', $data + [
            'id' => $user->id, 'game_balance' => 123, 'xp' => 10, 'level' => 2,
            'password' => $password, 'email_verified_at' => $verifiedAt, 'dob' => null,
        ]);
        $this->assertSame('Other', $other->fresh()->name);
        $this->actingAs($user->fresh())->get('/profile')->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.full_name', 'Alex Rider')->where('profile.street', 'Storgata 12'));
    }

    public function test_missing_required_details_are_rejected_without_partial_update(): void
    {
        $user = User::factory()->create(['name' => 'Original']);
        $this->actingAs($user)->from('/profile')->patch('/profile', [])
            ->assertRedirect('/profile')->assertSessionHasErrors([
                'name', 'surname', 'email', 'phone', 'street', 'city', 'country', 'post_code',
            ]);
        $this->assertSame('Original', $user->fresh()->name);
    }

    public static function invalidDetails(): array
    {
        return [
            'unknown country' => ['country', 'Atlantis'],
            'restricted country' => ['country', 'Russia'],
            'invalid email' => ['email', 'not-an-email'],
            'long phone' => ['phone', str_repeat('1', 31)],
            'long postal code' => ['post_code', str_repeat('1', 21)],
            'long name' => ['name', str_repeat('a', 256)],
            'long street' => ['street', str_repeat('a', 256)],
        ];
    }

    #[DataProvider('invalidDetails')]
    public function test_invalid_details_do_not_change_user(string $field, string $value): void
    {
        $user = User::factory()->create(['name' => 'Original']);
        $data = array_replace($this->profileData($user->email), [$field => $value]);
        $this->actingAs($user)->patch('/profile', $data)->assertSessionHasErrors($field);
        $this->assertSame('Original', $user->fresh()->name);
    }

    public function test_email_change_requires_correct_current_password_and_does_not_flash_it(): void
    {
        $user = User::factory()->create();
        $data = $this->profileData('new@example.com');
        $this->actingAs($user)->patch('/profile', $data)->assertSessionHasErrors('current_password');
        $this->patch('/profile', $data + ['current_password' => 'wrong-password'])
            ->assertSessionHasErrors(['current_password' => 'The password is incorrect.'])
            ->assertSessionMissing('_old_input.current_password');
        $this->assertSame($user->email, $user->fresh()->email);

        $this->patch('/profile', $data + ['current_password' => 'password'])
            ->assertRedirect('/profile')->assertSessionHasNoErrors();
        $this->assertDatabaseHas('users', ['id' => $user->id, 'email' => 'new@example.com', 'email_verified_at' => null]);
    }

    public function test_email_already_used_by_another_account_is_rejected(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $this->actingAs($user)->patch('/profile', $this->profileData($other->email) + ['current_password' => 'password'])
            ->assertSessionHasErrors('email');
        $this->assertSame($user->email, $user->fresh()->email);
    }

    public function test_new_orders_use_updated_billing_and_previous_orders_keep_their_snapshot(): void
    {
        $user = User::factory()->create(['name' => 'Old', 'street' => 'Old street']);
        $order = ['package_id' => 'racer_pack', 'gateway' => 'credit_card'];
        $this->actingAs($user)->post('/topup/order', $order)->assertRedirect();
        $oldOrder = Transaction::sole();
        $snapshot = $oldOrder->customer_snapshot;

        $this->patch('/profile', $this->profileData($user->email))->assertSessionHasNoErrors();
        $this->post('/topup/order', $order)->assertRedirect();

        $this->assertSame($snapshot, $oldOrder->fresh()->customer_snapshot);
        $newOrder = Transaction::where('id', '!=', $oldOrder->id)->sole();
        $this->assertSame('Alex Rider', $newOrder->customer_snapshot['name']);
        $this->assertSame('Storgata 12', $newOrder->customer_snapshot['street']);
        $this->assertSame('Norway', $newOrder->customer_snapshot['country']);
    }

    public static function translatedSuccessMessages(): array
    {
        return [['nb', 'Profilen er oppdatert.', 'Passordet er feil.'], ['sv', 'Profilen har uppdaterats.', 'Lösenordet är felaktigt.']];
    }

    #[DataProvider('translatedSuccessMessages')]
    public function test_profile_success_and_password_errors_use_selected_language(string $locale, string $success, string $passwordError): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->withSession(['locale' => $locale])->patch('/profile', $this->profileData($user->email))
            ->assertSessionHas('success', $success);
        $this->patch('/profile', $this->profileData('new@example.com') + ['current_password' => 'wrong'])
            ->assertSessionHasErrors(['current_password' => $passwordError]);
    }
}
