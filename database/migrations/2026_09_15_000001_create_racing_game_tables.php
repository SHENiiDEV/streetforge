<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Vehicles
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('class_type')->default('Sport'); // Street, Muscle, Sport, Hyper
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->string('primary_color')->default('#ef4444');
            $table->integer('base_speed')->default(180); // km/h
            $table->integer('base_handling')->default(65); // 1-100
            $table->integer('base_acceleration')->default(60); // 1-100
            $table->integer('base_nitro')->default(50); // 1-100
            $table->decimal('price', 12, 2)->default(0); // 0 = starter car
            $table->boolean('unlocked_by_default')->default(false);
            $table->timestamps();
        });

        // 2. Skins (Liveries / Visual Customizations)
        Schema::create('skins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->string('name');
            $table->string('skin_type')->default('color'); // color, livery, neon, carbon
            $table->string('color_hex')->default('#3b82f6');
            $table->string('secondary_color_hex')->nullable();
            $table->string('glow_color')->nullable();
            $table->string('asset_pattern')->nullable();
            $table->decimal('price', 12, 2)->default(250.00);
            $table->timestamps();
        });

        // 3. Upgrades (Performance Tuning Parts)
        Schema::create('upgrades', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // engine, turbo, tires, handling, nitro
            $table->integer('level')->default(1);
            $table->integer('speed_bonus')->default(0);
            $table->integer('handling_bonus')->default(0);
            $table->integer('accel_bonus')->default(0);
            $table->integer('nitro_bonus')->default(0);
            $table->decimal('price', 12, 2)->default(300.00);
            $table->string('icon')->default('Zap');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 4. User Vehicles (Player Garage)
        Schema::create('user_vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('skin_id')->nullable()->constrained('skins')->nullOnDelete();
            $table->integer('current_speed');
            $table->integer('current_handling');
            $table->integer('current_acceleration');
            $table->integer('current_nitro');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // 5. User Upgrades (Installed tuning parts on specific car)
        Schema::create('user_vehicle_upgrades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('user_vehicle_id')->constrained('user_vehicles')->cascadeOnDelete();
            $table->foreignId('upgrade_id')->constrained('upgrades')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_vehicle_id', 'upgrade_id']);
        });

        // 6. User Owned Skins
        Schema::create('user_skins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('skin_id')->constrained('skins')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'skin_id']);
        });

        // 7. Transactions (Fiat Top-ups & Balance History)
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('transaction_ref')->unique();
            $table->string('gateway')->default('stripe_mock'); // stripe, paypal, crypto, mock
            $table->decimal('fiat_amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->decimal('game_credits', 12, 2);
            $table->enum('status', ['pending', 'success', 'failed', 'refunded'])->default('pending');
            $table->string('invoice_number')->unique()->nullable();
            $table->string('invoice_path')->nullable();
            $table->json('customer_snapshot')->nullable();
            $table->json('gateway_response')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // 8. Race Tracks
        Schema::create('race_tracks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('theme')->default('cyber_city'); // cyber_city, neon_highway, canyon_drift
            $table->string('difficulty')->default('Medium'); // Easy, Medium, Hard, Pro
            $table->integer('laps')->default(2);
            $table->integer('length_meters')->default(2400);
            $table->decimal('reward_currency_1st', 10, 2)->default(350);
            $table->decimal('reward_currency_2nd', 10, 2)->default(200);
            $table->decimal('reward_currency_3rd', 10, 2)->default(100);
            $table->integer('reward_xp_1st')->default(150);
            $table->integer('reward_xp_2nd')->default(90);
            $table->integer('reward_xp_3rd')->default(50);
            $table->text('description')->nullable();
            $table->json('track_data')->nullable(); // Points, obstacles, turns
            $table->timestamps();
        });

        // 9. Race Results / History
        Schema::create('race_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('race_track_id')->constrained('race_tracks')->cascadeOnDelete();
            $table->foreignId('user_vehicle_id')->nullable()->constrained('user_vehicles')->nullOnDelete();
            $table->integer('position'); // 1, 2, 3, 4
            $table->decimal('race_time_seconds', 8, 2);
            $table->decimal('best_lap_seconds', 8, 2)->nullable();
            $table->decimal('reward_currency', 10, 2)->default(0);
            $table->integer('reward_xp')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('race_results');
        Schema::dropIfExists('race_tracks');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('user_skins');
        Schema::dropIfExists('user_vehicle_upgrades');
        Schema::dropIfExists('user_vehicles');
        Schema::dropIfExists('upgrades');
        Schema::dropIfExists('skins');
        Schema::dropIfExists('vehicles');
    }
};
