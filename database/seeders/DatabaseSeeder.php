<?php

namespace Database\Seeders;

use App\Models\RaceResult;
use App\Models\RaceTrack;
use App\Models\Skin;
use App\Models\Transaction;
use App\Models\Upgrade;
use App\Models\User;
use App\Models\UserVehicle;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create 8 Diverse Vehicles
        $v1 = Vehicle::create([
            'name' => 'Apex Pulse GT',
            'slug' => 'apex-pulse-gt',
            'class_type' => 'Sport',
            'description' => 'Lightweight rear-wheel-drive starter platform tuned for nimble cornering and rapid throttle response.',
            'primary_color' => '#06b6d4',
            'base_speed' => 210,
            'base_handling' => 75,
            'base_acceleration' => 70,
            'base_nitro' => 60,
            'price' => 0.00,
            'unlocked_by_default' => true,
        ]);

        $v2 = Vehicle::create([
            'name' => 'Drift King S15',
            'slug' => 'drift-king-s15',
            'class_type' => 'Drift Spec',
            'description' => 'Specialized angle kit and locked differential for surgical counter-steering and high-speed drift lines.',
            'primary_color' => '#f43f5e',
            'base_speed' => 235,
            'base_handling' => 92,
            'base_acceleration' => 78,
            'base_nitro' => 75,
            'price' => 3200.00,
            'unlocked_by_default' => false,
        ]);

        $v3 = Vehicle::create([
            'name' => 'Shinobi Horizon GTR',
            'slug' => 'shinobi-horizon-gtr',
            'class_type' => 'JDM Tuner',
            'description' => 'Legendary inline-6 twin-turbo AWD rocket with aggressive aero and endless tuning headroom.',
            'primary_color' => '#10b981',
            'base_speed' => 260,
            'base_handling' => 88,
            'base_acceleration' => 84,
            'base_nitro' => 75,
            'price' => 3800.00,
            'unlocked_by_default' => false,
        ]);

        $v4 = Vehicle::create([
            'name' => 'Vortex Shadow R',
            'slug' => 'vortex-shadow-r',
            'class_type' => 'Street Turbo',
            'description' => 'All-wheel drive turbocharged beast built for aggressive launch acceleration and high-speed street battles.',
            'primary_color' => '#f97316',
            'base_speed' => 240,
            'base_handling' => 82,
            'base_acceleration' => 85,
            'base_nitro' => 70,
            'price' => 2500.00,
            'unlocked_by_default' => false,
        ]);

        $v5 = Vehicle::create([
            'name' => 'Titan Venom V8',
            'slug' => 'titan-venom-v8',
            'class_type' => 'Muscle V8',
            'description' => 'Supercharged 6.2L V8 muscle engineered for straight-line velocity and thunderous engine roar.',
            'primary_color' => '#ef4444',
            'base_speed' => 270,
            'base_handling' => 68,
            'base_acceleration' => 88,
            'base_nitro' => 90,
            'price' => 4500.00,
            'unlocked_by_default' => false,
        ]);

        $v6 = Vehicle::create([
            'name' => 'Phantom Eclipse GT',
            'slug' => 'phantom-eclipse-gt',
            'class_type' => 'Supercar',
            'description' => 'Mid-engine Italian exotic with screaming V12 acoustics and surgical aerodynamic downforce.',
            'primary_color' => '#eab308',
            'base_speed' => 285,
            'base_handling' => 86,
            'base_acceleration' => 90,
            'base_nitro' => 80,
            'price' => 6200.00,
            'unlocked_by_default' => false,
        ]);

        $v7 = Vehicle::create([
            'name' => 'Cyber Hyperion X',
            'slug' => 'cyber-hyperion-x',
            'class_type' => 'Hypercar',
            'description' => 'Futuristic electric hypercar featuring quad-motors, active aerodynamics, and instant 1,400 HP torque.',
            'primary_color' => '#a855f7',
            'base_speed' => 295,
            'base_handling' => 90,
            'base_acceleration' => 95,
            'base_nitro' => 85,
            'price' => 7500.00,
            'unlocked_by_default' => false,
        ]);

        $v8 = Vehicle::create([
            'name' => 'Apex Formula Proto 01',
            'slug' => 'apex-formula-proto-01',
            'class_type' => 'Formula Prototype',
            'description' => 'Ultra-lightweight carbon open-wheel racer with ground-effect venturis for blistering cornering G-forces.',
            'primary_color' => '#3b82f6',
            'base_speed' => 325,
            'base_handling' => 98,
            'base_acceleration' => 98,
            'base_nitro' => 95,
            'price' => 12500.00,
            'unlocked_by_default' => false,
        ]);

        // 2. Create Skins for All Vehicles
        $skins = [
            // Apex Pulse GT
            ['vehicle_id' => $v1->id, 'name' => 'Cyber Cyan', 'skin_type' => 'neon', 'color_hex' => '#06b6d4', 'secondary_color_hex' => '#0891b2', 'glow_color' => '#22d3ee', 'price' => 0.00],
            ['vehicle_id' => $v1->id, 'name' => 'Midnight Stealth', 'skin_type' => 'carbon', 'color_hex' => '#1e293b', 'secondary_color_hex' => '#0f172a', 'glow_color' => '#64748b', 'price' => 300.00],
            ['vehicle_id' => $v1->id, 'name' => 'Crimson Blaze', 'skin_type' => 'color', 'color_hex' => '#dc2626', 'secondary_color_hex' => '#991b1b', 'glow_color' => '#f87171', 'price' => 450.00],

            // Drift King S15
            ['vehicle_id' => $v2->id, 'name' => 'Sakura Drift Pink', 'skin_type' => 'livery', 'color_hex' => '#f43f5e', 'secondary_color_hex' => '#be123c', 'glow_color' => '#fda4af', 'price' => 0.00],
            ['vehicle_id' => $v2->id, 'name' => 'Night Touge Purple', 'skin_type' => 'neon', 'color_hex' => '#8b5cf6', 'secondary_color_hex' => '#6d28d9', 'glow_color' => '#c4b5fd', 'price' => 550.00],

            // Shinobi Horizon GTR
            ['vehicle_id' => $v3->id, 'name' => 'Bayside Emerald', 'skin_type' => 'color', 'color_hex' => '#10b981', 'secondary_color_hex' => '#047857', 'glow_color' => '#6ee7b7', 'price' => 0.00],
            ['vehicle_id' => $v3->id, 'name' => 'Calsonic Racing Blue', 'skin_type' => 'livery', 'color_hex' => '#2563eb', 'secondary_color_hex' => '#1d4ed8', 'glow_color' => '#60a5fa', 'price' => 650.00],

            // Vortex Shadow R
            ['vehicle_id' => $v4->id, 'name' => 'Sunset Orange', 'skin_type' => 'color', 'color_hex' => '#f97316', 'secondary_color_hex' => '#c2410c', 'glow_color' => '#fb923c', 'price' => 0.00],
            ['vehicle_id' => $v4->id, 'name' => 'Toxic Lime Glow', 'skin_type' => 'neon', 'color_hex' => '#84cc16', 'secondary_color_hex' => '#4d7c0f', 'glow_color' => '#bef264', 'price' => 500.00],

            // Titan Venom V8
            ['vehicle_id' => $v5->id, 'name' => 'Hotrod Flame Red', 'skin_type' => 'livery', 'color_hex' => '#ef4444', 'secondary_color_hex' => '#b91c1c', 'glow_color' => '#fca5a5', 'price' => 0.00],
            ['vehicle_id' => $v5->id, 'name' => 'Matte Gunmetal Raw', 'skin_type' => 'color', 'color_hex' => '#334155', 'secondary_color_hex' => '#1e293b', 'glow_color' => '#94a3b8', 'price' => 600.00],

            // Phantom Eclipse GT
            ['vehicle_id' => $v6->id, 'name' => 'Modena Giallo Yellow', 'skin_type' => 'color', 'color_hex' => '#eab308', 'secondary_color_hex' => '#a16207', 'glow_color' => '#fef08a', 'price' => 0.00],
            ['vehicle_id' => $v6->id, 'name' => 'Carbon Onyx Nero', 'skin_type' => 'carbon', 'color_hex' => '#0f172a', 'secondary_color_hex' => '#020617', 'glow_color' => '#475569', 'price' => 850.00],

            // Cyber Hyperion X
            ['vehicle_id' => $v7->id, 'name' => 'Neon Synthwave Violet', 'skin_type' => 'neon', 'color_hex' => '#a855f7', 'secondary_color_hex' => '#7e22ce', 'glow_color' => '#c084fc', 'price' => 0.00],
            ['vehicle_id' => $v7->id, 'name' => 'Golden Monarch Luxury', 'skin_type' => 'livery', 'color_hex' => '#f59e0b', 'secondary_color_hex' => '#b45309', 'glow_color' => '#fde68a', 'price' => 1200.00],

            // Apex Formula Proto 01
            ['vehicle_id' => $v8->id, 'name' => 'Apex Factory Racing Blue', 'skin_type' => 'livery', 'color_hex' => '#3b82f6', 'secondary_color_hex' => '#1d4ed8', 'glow_color' => '#93c5fd', 'price' => 0.00],
            ['vehicle_id' => $v8->id, 'name' => 'Stealth Matte Aero Black', 'skin_type' => 'carbon', 'color_hex' => '#18181b', 'secondary_color_hex' => '#09090b', 'glow_color' => '#52525b', 'price' => 1500.00],
        ];

        $createdSkins = [];
        foreach ($skins as $s) {
            $createdSkins[] = Skin::create($s);
        }

        // 3. Create 22 Progressive Tuning Upgrades across 6 Categories
        $upgrades = [
            // Category: Engine & ECU (5 Stages)
            ['name' => 'Stage 1: Street ECU Remap', 'type' => 'engine', 'level' => 1, 'speed_bonus' => 12, 'handling_bonus' => 0, 'accel_bonus' => 6, 'nitro_bonus' => 0, 'price' => 350.00, 'icon' => 'Cpu', 'description' => 'Optimized fuel mapping and ignition timing for immediate horsepower gains.'],
            ['name' => 'Stage 2: High-Flow Intake & Titanium Exhaust', 'type' => 'engine', 'level' => 2, 'speed_bonus' => 16, 'handling_bonus' => 0, 'accel_bonus' => 9, 'nitro_bonus' => 0, 'price' => 650.00, 'icon' => 'Flame', 'description' => 'Unrestricted airflow and lightweight exhaust reducing backpressure.'],
            ['name' => 'Stage 3: Twin-Ball-Bearing Turbo Kit', 'type' => 'engine', 'level' => 3, 'speed_bonus' => 24, 'handling_bonus' => 0, 'accel_bonus' => 14, 'nitro_bonus' => 0, 'price' => 1200.00, 'icon' => 'Zap', 'description' => 'Forced induction delivering high boost pressure across all RPM bands.'],
            ['name' => 'Stage 4: Forged Pistons & Billet Camshaft', 'type' => 'engine', 'level' => 4, 'speed_bonus' => 32, 'handling_bonus' => 0, 'accel_bonus' => 19, 'nitro_bonus' => 0, 'price' => 2200.00, 'icon' => 'Cpu', 'description' => 'Ultra-strong internal engine assembly built to safely sustain 9,500 RPM.'],
            ['name' => 'Stage 5: Pro Racing Engine Blueprint Swap', 'type' => 'engine', 'level' => 5, 'speed_bonus' => 45, 'handling_bonus' => 0, 'accel_bonus' => 26, 'nitro_bonus' => 0, 'price' => 3800.00, 'icon' => 'Flame', 'description' => 'Hand-built competition motorsport powerplant pushing top speed to the absolute limit.'],

            // Category: Drivetrain & Transmission (4 Stages)
            ['name' => 'Stage 1: Short-Throw Sport Shifter', 'type' => 'drivetrain', 'level' => 1, 'speed_bonus' => 2, 'handling_bonus' => 0, 'accel_bonus' => 5, 'nitro_bonus' => 0, 'price' => 280.00, 'icon' => 'Sliders', 'description' => 'Reduces gear throw distance by 40% for faster shift synchronization.'],
            ['name' => 'Stage 2: Carbon Twin-Plate Clutch & Flywheel', 'type' => 'drivetrain', 'level' => 2, 'speed_bonus' => 4, 'handling_bonus' => 0, 'accel_bonus' => 10, 'nitro_bonus' => 0, 'price' => 680.00, 'icon' => 'Disc', 'description' => 'Lightweight rotational inertia providing instant power bite from launch.'],
            ['name' => 'Stage 3: 7-Speed Sequential Race Gearbox', 'type' => 'drivetrain', 'level' => 3, 'speed_bonus' => 8, 'handling_bonus' => 0, 'accel_bonus' => 16, 'nitro_bonus' => 0, 'price' => 1500.00, 'icon' => 'Sliders', 'description' => 'Pneumatic dog-ring paddle shifting with zero torque drop between gears.'],
            ['name' => 'Stage 4: Carbon Driveshaft & Multi-Disc LSD', 'type' => 'drivetrain', 'level' => 4, 'speed_bonus' => 12, 'handling_bonus' => 5, 'accel_bonus' => 22, 'nitro_bonus' => 0, 'price' => 2600.00, 'icon' => 'CircleDot', 'description' => 'Torque-vectoring limited slip differential maximizing corner exit drive.'],

            // Category: Suspension & Handling (4 Stages)
            ['name' => 'Stage 1: Sport Lowering Springs', 'type' => 'suspension', 'level' => 1, 'speed_bonus' => 0, 'handling_bonus' => 8, 'accel_bonus' => 2, 'nitro_bonus' => 0, 'price' => 300.00, 'icon' => 'Compass', 'description' => 'Lowers center of gravity and minimizes chassis roll through high-speed turns.'],
            ['name' => 'Stage 2: 3-Way Adjustable Track Coilovers', 'type' => 'suspension', 'level' => 2, 'speed_bonus' => 0, 'handling_bonus' => 16, 'accel_bonus' => 3, 'nitro_bonus' => 0, 'price' => 750.00, 'icon' => 'Sliders', 'description' => 'Customizable rebound, compression, and negative camber for razor-sharp turn-in.'],
            ['name' => 'Stage 3: Active Magnetic Dampers', 'type' => 'suspension', 'level' => 3, 'speed_bonus' => 0, 'handling_bonus' => 24, 'accel_bonus' => 4, 'nitro_bonus' => 0, 'price' => 1600.00, 'icon' => 'Zap', 'description' => 'Real-time 1,000Hz magnetic fluid damping reacting instantaneously to track curbs.'],
            ['name' => 'Stage 4: Tubular Subframes & Anti-Roll Sway Bars', 'type' => 'suspension', 'level' => 4, 'speed_bonus' => 4, 'handling_bonus' => 32, 'accel_bonus' => 5, 'nitro_bonus' => 0, 'price' => 2800.00, 'icon' => 'Compass', 'description' => 'Extreme structural rigidity eliminating chassis flex at maximum cornering G-force.'],

            // Category: Tires & Braking (4 Stages)
            ['name' => 'Stage 1: Sport Compound Radial Tires', 'type' => 'tires', 'level' => 1, 'speed_bonus' => 2, 'handling_bonus' => 7, 'accel_bonus' => 5, 'nitro_bonus' => 0, 'price' => 320.00, 'icon' => 'Disc', 'description' => 'Enhanced tread contact patch providing steady lateral grip on asphalt.'],
            ['name' => 'Stage 2: Semi-Slick Tires & 4-Piston Calipers', 'type' => 'tires', 'level' => 2, 'speed_bonus' => 4, 'handling_bonus' => 14, 'accel_bonus' => 10, 'nitro_bonus' => 0, 'price' => 820.00, 'icon' => 'CircleDot', 'description' => 'Aggressive semi-slick compound and ventilated steel discs for late braking.'],
            ['name' => 'Stage 3: Competition Full Slick Tires', 'type' => 'tires', 'level' => 3, 'speed_bonus' => 6, 'handling_bonus' => 22, 'accel_bonus' => 15, 'nitro_bonus' => 0, 'price' => 1750.00, 'icon' => 'Disc', 'description' => 'Zero-tread ultra-soft compound for unmatched cornering speed on dry asphalt.'],
            ['name' => 'Stage 4: Carbon-Ceramic Brakes & Heated Slicks', 'type' => 'tires', 'level' => 4, 'speed_bonus' => 8, 'handling_bonus' => 30, 'accel_bonus' => 20, 'nitro_bonus' => 0, 'price' => 3100.00, 'icon' => 'CircleDot', 'description' => 'Fade-free carbon-ceramic stopping power and pre-heated racing tire blankets.'],

            // Category: Nitrous Oxide System (4 Stages)
            ['name' => 'Stage 1: 50-Shot Wet Nitrous Kit', 'type' => 'nitro', 'level' => 1, 'speed_bonus' => 4, 'handling_bonus' => 0, 'accel_bonus' => 4, 'nitro_bonus' => 15, 'price' => 350.00, 'icon' => 'Gauge', 'description' => 'Pressurized nitrous bottle providing instant bursts of overtaking speed.'],
            ['name' => 'Stage 2: Dual Bottle 100-Shot Setup', 'type' => 'nitro', 'level' => 2, 'speed_bonus' => 8, 'handling_bonus' => 0, 'accel_bonus' => 8, 'nitro_bonus' => 30, 'price' => 850.00, 'icon' => 'Rocket', 'description' => 'Dual bottle delivery with purge valves for longer and stronger boost duration.'],
            ['name' => 'Stage 3: Cryogenic Nitrous Direct Injection', 'type' => 'nitro', 'level' => 3, 'speed_bonus' => 14, 'handling_bonus' => 0, 'accel_bonus' => 14, 'nitro_bonus' => 48, 'price' => 1800.00, 'icon' => 'Flame', 'description' => 'Sub-zero cryo delivery maximizing oxygen density inside combustion chambers.'],
            ['name' => 'Stage 4: Quad Cryo-Thrusters & Overdrive Pulse', 'type' => 'nitro', 'level' => 4, 'speed_bonus' => 22, 'handling_bonus' => 0, 'accel_bonus' => 20, 'nitro_bonus' => 65, 'price' => 3200.00, 'icon' => 'Rocket', 'description' => 'High-pressure quad manifold injection giving hyper-velocity acceleration.'],

            // Category: Aerodynamics & Weight (3 Stages)
            ['name' => 'Stage 1: Carbon Fiber Hood & Trunk Lid', 'type' => 'aero', 'level' => 1, 'speed_bonus' => 3, 'handling_bonus' => 5, 'accel_bonus' => 5, 'nitro_bonus' => 0, 'price' => 420.00, 'icon' => 'Sliders', 'description' => 'Saves 60kg of chassis weight for improved power-to-weight agility.'],
            ['name' => 'Stage 2: Active Downforce Rear Wing & Diffuser', 'type' => 'aero', 'level' => 2, 'speed_bonus' => 7, 'handling_bonus' => 15, 'accel_bonus' => 6, 'nitro_bonus' => 0, 'price' => 1100.00, 'icon' => 'Compass', 'description' => 'Speed-activated DRS rear spoiler and venturi floor suck car to the tarmac.'],
            ['name' => 'Stage 3: Full Carbon Monocoque & Widebody Aero', 'type' => 'aero', 'level' => 3, 'speed_bonus' => 15, 'handling_bonus' => 28, 'accel_bonus' => 14, 'nitro_bonus' => 0, 'price' => 2900.00, 'icon' => 'Zap', 'description' => 'FIA GT3-spec widebody conversion and autoclaved carbon honeycomb monocoque.'],
        ];

        foreach ($upgrades as $u) {
            Upgrade::create($u);
        }

        // 4. Create Race Tracks
        $t1 = RaceTrack::create([
            'name' => 'Neon City Grand Prix',
            'slug' => 'neon-city-grand-prix',
            'theme' => 'cyber_city',
            'difficulty' => 'Medium',
            'laps' => 2,
            'length_meters' => 2800,
            'reward_currency_1st' => 550.00,
            'reward_currency_2nd' => 320.00,
            'reward_currency_3rd' => 180.00,
            'reward_xp_1st' => 220,
            'reward_xp_2nd' => 130,
            'reward_xp_3rd' => 70,
            'description' => 'High-speed urban circuit through neon skyscrapers, sharp bridge corners, and underground speed tunnels.',
        ]);

        $t2 = RaceTrack::create([
            'name' => 'Cyber Highway Sprint',
            'slug' => 'cyber-highway-sprint',
            'theme' => 'neon_highway',
            'difficulty' => 'Easy',
            'laps' => 2,
            'length_meters' => 2200,
            'reward_currency_1st' => 380.00,
            'reward_currency_2nd' => 220.00,
            'reward_currency_3rd' => 110.00,
            'reward_xp_1st' => 150,
            'reward_xp_2nd' => 90,
            'reward_xp_3rd' => 45,
            'description' => 'Wide multi-lane elevated highway suited for testing raw top speed, drafting, and nitro timing.',
        ]);

        $t3 = RaceTrack::create([
            'name' => 'Canyon Drift Pass',
            'slug' => 'canyon-drift-pass',
            'theme' => 'canyon_drift',
            'difficulty' => 'Hard',
            'laps' => 3,
            'length_meters' => 3500,
            'reward_currency_1st' => 850.00,
            'reward_currency_2nd' => 500.00,
            'reward_currency_3rd' => 260.00,
            'reward_xp_1st' => 340,
            'reward_xp_2nd' => 190,
            'reward_xp_3rd' => 100,
            'description' => 'Demanding mountain hairpins, sudden elevation drops, and switchbacks testing drift control and handling.',
        ]);

        // 5. Create Default User (Alex Rider)
        $user = User::create([
            'name' => 'Alex',
            'surname' => 'Rider',
            'email' => 'racer@streetforge.co.uk',
            'phone' => '+49 151 23456789',
            'dob' => '1996-05-18',
            'country' => 'Germany',
            'city' => 'Berlin',
            'street' => 'Friedrichstraße 43, Apt 12',
            'post_code' => '10117',
            'game_balance' => 4500.00,
            'xp' => 750,
            'level' => 4,
            'avatar_color' => '#06b6d4',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Give user starter car
        $userCar = UserVehicle::create([
            'user_id' => $user->id,
            'vehicle_id' => $v1->id,
            'skin_id' => $createdSkins[0]->id,
            'current_speed' => $v1->base_speed,
            'current_handling' => $v1->base_handling,
            'current_acceleration' => $v1->base_acceleration,
            'current_nitro' => $v1->base_nitro,
            'is_active' => true,
        ]);

        $user->ownedSkins()->attach($createdSkins[0]->id);

        // Install a couple of initial upgrades to demonstrate tuning
        $initialUpgrades = Upgrade::whereIn('level', [1])->take(2)->get();
        foreach ($initialUpgrades as $upg) {
            $userCar->upgrades()->attach($upg->id, ['user_id' => $user->id]);
        }
        $userCar->recalculateStats();

        // Top-up transaction
        Transaction::create([
            'user_id' => $user->id,
            'transaction_ref' => 'TOP-' . strtoupper(Str::random(10)),
            'gateway' => 'credit_card',
            'fiat_amount' => 25.00,
            'currency' => 'USD',
            'game_credits' => 2750.00,
            'status' => 'success',
            'invoice_number' => 'INV-2026-0001',
            'customer_snapshot' => [
                'name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'street' => $user->street,
                'city' => $user->city,
                'country' => $user->country,
                'post_code' => $user->post_code,
            ],
            'gateway_response' => [
                'payment_intent' => 'pi_mock_98124971249',
                'brand' => 'Visa',
                'last4' => '4242',
            ],
            'completed_at' => now()->subDays(2),
        ]);

        // 6. Create realistic bot race results for global leaderboard
        $maskedRacers = [
            ['name' => 'ShadowDrifter', 'surname' => 'Apex', 'country' => 'Germany', 'city' => 'Munich', 'level' => 38, 'xp' => 9500, 'balance' => 24500, 'avatar' => '#f43f5e', 'vehicle' => $v8, 'track' => $t1, 'time' => 58.42, 'lap' => 28.90],
            ['name' => 'Klaus_V8', 'surname' => 'Weber', 'country' => 'Austria', 'city' => 'Vienna', 'level' => 34, 'xp' => 8400, 'balance' => 18200, 'avatar' => '#ef4444', 'vehicle' => $v5, 'track' => $t2, 'time' => 59.80, 'lap' => 29.40],
            ['name' => 'Yuki_Drift99', 'surname' => 'Takahashi', 'country' => 'Japan', 'city' => 'Tokyo', 'level' => 31, 'xp' => 7600, 'balance' => 15300, 'avatar' => '#10b981', 'vehicle' => $v3, 'track' => $t3, 'time' => 61.15, 'lap' => 29.80],
            ['name' => 'Elena_Cyber', 'surname' => 'Vasiliev', 'country' => 'Cyprus', 'city' => 'Limassol', 'level' => 29, 'xp' => 7100, 'balance' => 14000, 'avatar' => '#a855f7', 'vehicle' => $v7, 'track' => $t1, 'time' => 61.90, 'lap' => 30.20],
            ['name' => 'Apex_Stig', 'surname' => 'Lindqvist', 'country' => 'Sweden', 'city' => 'Stockholm', 'level' => 27, 'xp' => 6700, 'balance' => 12900, 'avatar' => '#3b82f6', 'vehicle' => $v6, 'track' => $t1, 'time' => 62.40, 'lap' => 30.70],
            ['name' => 'NightRider_US', 'surname' => 'Miller', 'country' => 'United States', 'city' => 'Detroit', 'level' => 24, 'xp' => 5800, 'balance' => 9800, 'avatar' => '#f97316', 'vehicle' => $v5, 'track' => $t2, 'time' => 63.85, 'lap' => 31.40],
            ['name' => 'TurboMax_FR', 'surname' => 'Dubois', 'country' => 'France', 'city' => 'Lyon', 'level' => 21, 'xp' => 5100, 'balance' => 8200, 'avatar' => '#06b6d4', 'vehicle' => $v4, 'track' => $t2, 'time' => 64.70, 'lap' => 31.90],
            ['name' => 'DriftQueen_PL', 'surname' => 'Kowalska', 'country' => 'Poland', 'city' => 'Warsaw', 'level' => 19, 'xp' => 4600, 'balance' => 7400, 'avatar' => '#ec4899', 'vehicle' => $v2, 'track' => $t3, 'time' => 65.50, 'lap' => 32.10],
            ['name' => 'Marco_Monza', 'surname' => 'Rossi', 'country' => 'Italy', 'city' => 'Milan', 'level' => 17, 'xp' => 4100, 'balance' => 6100, 'avatar' => '#eab308', 'vehicle' => $v6, 'track' => $t1, 'time' => 66.20, 'lap' => 32.80],
            ['name' => 'VortexX_ES', 'surname' => 'Garcia', 'country' => 'Spain', 'city' => 'Barcelona', 'level' => 15, 'xp' => 3600, 'balance' => 5300, 'avatar' => '#14b8a6', 'vehicle' => $v4, 'track' => $t3, 'time' => 67.40, 'lap' => 33.20],
        ];

        foreach ($maskedRacers as $bot) {
            $botUser = User::create([
                'name' => $bot['name'],
                'surname' => $bot['surname'],
                'email' => strtolower($bot['name']) . '@racer.streetforge.co.uk',
                'phone' => '+49 150 ' . rand(1000000, 9999999),
                'dob' => '1995-03-12',
                'country' => $bot['country'],
                'city' => $bot['city'],
                'street' => 'Raceway Blvd ' . rand(10, 99),
                'post_code' => '80331',
                'game_balance' => $bot['balance'],
                'xp' => $bot['xp'],
                'level' => $bot['level'],
                'avatar_color' => $bot['avatar'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);

            $botCar = UserVehicle::create([
                'user_id' => $botUser->id,
                'vehicle_id' => $bot['vehicle']->id,
                'skin_id' => Skin::where('vehicle_id', $bot['vehicle']->id)->first()?->id,
                'current_speed' => $bot['vehicle']->base_speed + 25,
                'current_handling' => min(100, $bot['vehicle']->base_handling + 15),
                'current_acceleration' => min(100, $bot['vehicle']->base_acceleration + 15),
                'current_nitro' => min(100, $bot['vehicle']->base_nitro + 20),
                'is_active' => true,
            ]);

            RaceResult::create([
                'user_id' => $botUser->id,
                'race_track_id' => $bot['track']->id,
                'user_vehicle_id' => $botCar->id,
                'position' => 1,
                'race_time_seconds' => $bot['time'],
                'best_lap_seconds' => $bot['lap'],
                'reward_currency' => $bot['track']->reward_currency_1st,
                'reward_xp' => $bot['track']->reward_xp_1st,
                'created_at' => now()->subHours(rand(1, 48)),
            ]);
        }
    }
}
