<?php

namespace App\Http\Controllers;

use App\Models\RaceResult;
use App\Models\RaceTrack;
use App\Models\User;
use App\Models\UserVehicle;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    private function getSeasonsList(): array
    {
        return [
            [
                'id' => 'season-4',
                'name' => 'Season 4: Cyber Grand Prix',
                'year' => '2026',
                'dates' => '01 Sep 2026 – 30 Nov 2026',
                'status' => 'active',
                'status_label' => 'Live Season',
                'prize_pool' => '500,000 CR',
                'total_racers' => 542,
                'featured_track' => 'Neon City Grand Prix',
                'description' => 'The ongoing 2026 global championship battle. Drivers compete across all three Tier 1 circuits for the 500,000 CR purse and Master Division prestige.',
            ],
            [
                'id' => 'season-3',
                'name' => 'Season 3: Night Drift Dynasty',
                'year' => '2026',
                'dates' => '01 Jun 2026 – 31 Aug 2026',
                'status' => 'completed',
                'status_label' => 'Season Concluded',
                'prize_pool' => '350,000 CR',
                'total_racers' => 518,
                'featured_track' => 'Canyon Drift Pass',
                'description' => 'A technical season dominated by RWD and AWD drift specialists navigating high-angle switchbacks in Canyon Pass.',
                'winner' => [
                    'name' => 'ShadowDrifter',
                    'country' => '🇩🇪 Germany',
                    'vehicle' => 'Apex Formula Proto 01',
                    'best_lap' => '54.12s',
                    'mmr' => 2840,
                    'prize' => '150,000 CR',
                ]
            ],
            [
                'id' => 'season-2',
                'name' => 'Season 2: Apex Asphalt Rush',
                'year' => '2025',
                'dates' => '01 Jan 2026 – 31 May 2026',
                'status' => 'completed',
                'status_label' => 'Season Concluded',
                'prize_pool' => '250,000 CR',
                'total_racers' => 524,
                'featured_track' => 'Cyber Highway Sprint',
                'description' => 'Pure top speed battle featuring 380+ km/h straightaway shootouts along the neon-drenched expressway.',
                'winner' => [
                    'name' => 'Max_Velocity',
                    'country' => '🇬🇧 United Kingdom',
                    'vehicle' => 'Titan Venom V8',
                    'best_lap' => '55.08s',
                    'mmr' => 2790,
                    'prize' => '100,000 CR',
                ]
            ],
            [
                'id' => 'season-1',
                'name' => 'Season 1: Genesis Street Clash',
                'year' => '2025',
                'dates' => '01 Sep 2025 – 31 Dec 2025',
                'status' => 'completed',
                'status_label' => 'Inaugural Season',
                'prize_pool' => '150,000 CR',
                'total_racers' => 505,
                'featured_track' => 'Neon City Grand Prix',
                'description' => 'The foundation of StreetForge esports where the first 500 verified drivers inaugurated the leaderboard.',
                'winner' => [
                    'name' => 'CyberSamurai',
                    'country' => '🇯🇵 Japan',
                    'vehicle' => 'Shinobi Horizon GTR',
                    'best_lap' => '56.24s',
                    'mmr' => 2650,
                    'prize' => '75,000 CR',
                ]
            ],
        ];
    }

    /**
     * Generate deterministic, rich leaderboard records for 500+ participants
     */
    private function generateSeasonRacers(string $seasonId, ?User $currentUser = null): array
    {
        $factions = ['🇩🇪 Germany', '🇬🇧 UK', '🇯🇵 Japan', '🇺🇸 USA', '🇨🇾 Cyprus', '🇦🇹 Austria', '🇸🇪 Sweden', '🇫🇷 France', '🇮🇹 Italy', '🇳🇱 Netherlands', '🇨🇦 Canada', '🇦🇺 Australia', '🇨🇭 Switzerland', '🇧🇪 Belgium', '🇸🇬 Singapore', '🇦🇪 UAE'];
        $vehicles = [
            'Apex Formula Proto 01', 'Cyber Hyperion X', 'Shinobi Horizon GTR', 'Titan Venom V8', 
            'Phantom Eclipse GT', 'Drift King S15', 'Apex Pulse GT', 'Specter R34 GT'
        ];
        $tracks = ['Neon City Grand Prix', 'Canyon Drift Pass', 'Cyber Highway Sprint'];
        
        // Curated Top Elite Drivers per season
        $podiums = [
            'season-4' => [
                ['name' => 'ShadowDrifter', 'country' => '🇩🇪 Germany', 'car' => 'Apex Formula Proto 01', 'lap' => 53.84, 'mmr' => 2910, 'avatar' => '#3b82f6'],
                ['name' => 'Elena_Cyber', 'country' => '🇨🇾 Cyprus', 'car' => 'Cyber Hyperion X', 'lap' => 54.18, 'mmr' => 2875, 'avatar' => '#a855f7'],
                ['name' => 'Klaus_V8', 'country' => '🇦🇹 Austria', 'car' => 'Titan Venom V8', 'lap' => 54.62, 'mmr' => 2830, 'avatar' => '#ef4444'],
                ['name' => 'Apex_Stig', 'country' => '🇸🇪 Sweden', 'car' => 'Phantom Eclipse GT', 'lap' => 55.02, 'mmr' => 2790, 'avatar' => '#eab308'],
                ['name' => 'Yuki_Drift99', 'country' => '🇯🇵 Japan', 'car' => 'Shinobi Horizon GTR', 'lap' => 55.35, 'mmr' => 2760, 'avatar' => '#10b981'],
            ],
            'season-3' => [
                ['name' => 'ShadowDrifter', 'country' => '🇩🇪 Germany', 'car' => 'Apex Formula Proto 01', 'lap' => 54.12, 'mmr' => 2840, 'avatar' => '#3b82f6'],
                ['name' => 'Elena_Cyber', 'country' => '🇨🇾 Cyprus', 'car' => 'Cyber Hyperion X', 'lap' => 54.49, 'mmr' => 2810, 'avatar' => '#a855f7'],
                ['name' => 'Yuki_Drift99', 'country' => '🇯🇵 Japan', 'car' => 'Drift King S15', 'lap' => 54.90, 'mmr' => 2770, 'avatar' => '#10b981'],
                ['name' => 'Max_Velocity', 'country' => '🇬🇧 UK', 'car' => 'Titan Venom V8', 'lap' => 55.20, 'mmr' => 2740, 'avatar' => '#06b6d4'],
                ['name' => 'GhostRider_UK', 'country' => '🇬🇧 UK', 'car' => 'Phantom Eclipse GT', 'lap' => 55.50, 'mmr' => 2700, 'avatar' => '#64748b'],
            ],
            'season-2' => [
                ['name' => 'Max_Velocity', 'country' => '🇬🇧 UK', 'car' => 'Titan Venom V8', 'lap' => 55.08, 'mmr' => 2790, 'avatar' => '#06b6d4'],
                ['name' => 'Klaus_V8', 'country' => '🇦🇹 Austria', 'car' => 'Phantom Eclipse GT', 'lap' => 55.32, 'mmr' => 2760, 'avatar' => '#ef4444'],
                ['name' => 'Apex_Stig', 'country' => '🇸🇪 Sweden', 'car' => 'Apex Pulse GT', 'lap' => 55.70, 'mmr' => 2720, 'avatar' => '#eab308'],
                ['name' => 'ShadowDrifter', 'country' => '🇩🇪 Germany', 'car' => 'Shinobi Horizon GTR', 'lap' => 56.00, 'mmr' => 2690, 'avatar' => '#3b82f6'],
                ['name' => 'TurboNova', 'country' => '🇺🇸 USA', 'car' => 'Titan Venom V8', 'lap' => 56.30, 'mmr' => 2650, 'avatar' => '#f97316'],
            ],
            'season-1' => [
                ['name' => 'CyberSamurai', 'country' => '🇯🇵 Japan', 'car' => 'Shinobi Horizon GTR', 'lap' => 56.24, 'mmr' => 2650, 'avatar' => '#10b981'],
                ['name' => 'GhostRider_UK', 'country' => '🇬🇧 UK', 'car' => 'Apex Pulse GT', 'lap' => 56.60, 'mmr' => 2620, 'avatar' => '#64748b'],
                ['name' => 'TurboNova', 'country' => '🇺🇸 USA', 'car' => 'Phantom Eclipse GT', 'lap' => 56.95, 'mmr' => 2580, 'avatar' => '#f97316'],
                ['name' => 'Klaus_V8', 'country' => '🇦🇹 Austria', 'car' => 'Titan Venom V8', 'lap' => 57.30, 'mmr' => 2540, 'avatar' => '#ef4444'],
                ['name' => 'ViperQueen', 'country' => '🇫🇷 France', 'car' => 'Apex Pulse GT', 'lap' => 57.70, 'mmr' => 2500, 'avatar' => '#ec4899'],
            ],
        ];

        $firstNames = ['Alex', 'Liam', 'Marcus', 'Elena', 'Lucas', 'Noah', 'Matteo', 'Kai', 'Leo', 'Julian', 'Hugo', 'David', 'Oscar', 'Finn', 'Victor', 'Felix', 'Arthur', 'Mason', 'Oliver', 'Ethan', 'Zack', 'Ryder', 'Dante', 'Axel', 'Jax', 'Soren', 'Dmitri', 'Carlos', 'Marco', 'Sven', 'Tariq', 'Hiroshi', 'Kenji', 'Daisuke', 'Antoine', 'Lars', 'Magnus', 'Niko', 'Damian', 'Caleb'];
        $surnames = ['Vance', 'Rostova', 'Weber', 'Chen', 'Mueller', 'Silva', 'Dubois', 'Novak', 'Larsen', 'Lindqvist', 'Rossi', 'Moretti', 'Fischer', 'Schmidt', 'Schneider', 'Tanaka', 'Sato', 'Watanabe', 'Ito', 'Yamamoto', 'Kowalski', 'Santos', 'Becker', 'Wagner', 'Richter', 'Klein', 'Bauer', 'Meyer', 'Hoffmann', 'Schulz', 'Koch', 'Bauer', 'Richter', 'Wolf', 'Schwarz'];
        $tags = ['Apex', 'Drift', 'Turbo', 'Cyber', 'Nitro', 'V8', 'Ghost', 'Viper', 'Phantom', 'Pro', 'Speed', 'Street', 'Shift', 'Aero', 'Dyno', 'Overdrive', 'Zenith', 'Titan', 'Pulse', 'Hyper'];

        $seasonPodium = $podiums[$seasonId] ?? $podiums['season-4'];
        $totalRacersCount = 520;
        $racers = [];

        // Seed top podium
        foreach ($seasonPodium as $idx => $pod) {
            $rank = $idx + 1;
            $tier = $pod['mmr'] >= 2400 ? 'Master' : ($pod['mmr'] >= 2000 ? 'Diamond' : 'Platinum');
            $racers[] = [
                'rank' => $rank,
                'name' => $pod['name'],
                'country' => $pod['country'],
                'vehicle' => $pod['car'],
                'track' => $tracks[$idx % count($tracks)],
                'best_lap' => number_format($pod['lap'], 2) . 's',
                'best_lap_raw' => $pod['lap'],
                'total_time' => number_format($pod['lap'] * 2 + 1.2, 2) . 's',
                'mmr' => $pod['mmr'],
                'tier' => $tier,
                'level' => max(15, 30 - $idx * 3),
                'avatar_color' => $pod['avatar'],
                'is_current_user' => false,
                'prize' => $rank === 1 ? '150,000 CR' : ($rank === 2 ? '75,000 CR' : ($rank === 3 ? '40,000 CR' : '10,000 CR')),
            ];
        }

        // Insert current user into Season 4 at an active rank if authenticated
        $userInserted = false;
        $userRankTarget = 14; // Top 15 placement

        // Generate remaining 515+ drivers deterministically
        mt_srand(crc32($seasonId . '_streetforge_leaderboard'));

        for ($i = count($seasonPodium) + 1; $i <= $totalRacersCount; $i++) {
            if ($seasonId === 'season-4' && $currentUser && $i === $userRankTarget && !$userInserted) {
                $userBestLap = 56.45;
                $userMmr = 1200 + ($currentUser->level * 55) + 1100;
                $userTier = $userMmr >= 2400 ? 'Master' : ($userMmr >= 2000 ? 'Diamond' : ($userMmr >= 1600 ? 'Platinum' : 'Gold'));
                
                $activeCar = UserVehicle::where('user_id', $currentUser->id)
                    ->where('is_active', true)
                    ->with('vehicle')
                    ->first();

                $racers[] = [
                    'rank' => $i,
                    'name' => $currentUser->name . ($currentUser->surname ? ' ' . substr($currentUser->surname, 0, 1) . '.' : ''),
                    'country' => $currentUser->country ?? '🇬🇧 UK',
                    'vehicle' => $activeCar?->vehicle?->name ?? 'Apex Pulse GT',
                    'track' => 'Neon City Grand Prix',
                    'best_lap' => number_format($userBestLap, 2) . 's',
                    'best_lap_raw' => $userBestLap,
                    'total_time' => number_format($userBestLap * 2 + 1.4, 2) . 's',
                    'mmr' => $userMmr,
                    'tier' => $userTier,
                    'level' => $currentUser->level,
                    'avatar_color' => $currentUser->avatar_color ?? '#06b6d4',
                    'is_current_user' => true,
                    'prize' => '5,000 CR',
                ];
                $userInserted = true;
                continue;
            }

            $fn = $firstNames[mt_rand(0, count($firstNames) - 1)];
            $sn = $surnames[mt_rand(0, count($surnames) - 1)];
            $tag = $tags[mt_rand(0, count($tags) - 1)];
            $country = $factions[mt_rand(0, count($factions) - 1)];
            $car = $vehicles[mt_rand(0, count($vehicles) - 1)];
            $track = $tracks[mt_rand(0, count($tracks) - 1)];

            $handleStyles = [
                "{$tag}_{$fn}",
                "{$fn}_{$sn[0]}",
                "{$tag}{$sn}",
                "{$fn}_{$tag}99",
                "xX_{$fn}_Xx",
                "{$sn}_Speed",
            ];
            $driverName = $handleStyles[mt_rand(0, count($handleStyles) - 1)];

            // Curve MMR from 2650 down to 850
            $progress = ($i - 5) / ($totalRacersCount - 5);
            $mmr = (int) round(2650 - (pow($progress, 0.75) * 1750) + mt_rand(-15, 15));
            $mmr = max(800, min(2700, $mmr));

            // Lap time curve from 55.5s up to 1:24.0s
            $lapSeconds = round(55.5 + ($progress * 28.5) + (mt_rand(0, 80) / 100), 2);

            $tier = 'Bronze';
            if ($mmr >= 2400) $tier = 'Master';
            elseif ($mmr >= 2000) $tier = 'Diamond';
            elseif ($mmr >= 1600) $tier = 'Platinum';
            elseif ($mmr >= 1200) $tier = 'Gold';
            elseif ($mmr >= 950) $tier = 'Silver';

            $avatarColors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#eab308', '#64748b'];
            $avatar = $avatarColors[mt_rand(0, count($avatarColors) - 1)];
            $level = max(1, (int) round(25 * (1 - $progress) + mt_rand(0, 3)));

            $racers[] = [
                'rank' => $i,
                'name' => $driverName,
                'country' => $country,
                'vehicle' => $car,
                'track' => $track,
                'best_lap' => number_format($lapSeconds, 2) . 's',
                'best_lap_raw' => $lapSeconds,
                'total_time' => number_format($lapSeconds * 2 + mt_rand(10, 35) / 10, 2) . 's',
                'mmr' => $mmr,
                'tier' => $tier,
                'level' => $level,
                'avatar_color' => $avatar,
                'is_current_user' => false,
                'prize' => $i <= 10 ? '10,000 CR' : ($i <= 50 ? '2,500 CR' : ($i <= 100 ? '1,000 CR' : '-')),
            ];
        }

        return $racers;
    }

    public function index(Request $request): Response
    {
        $seasons = $this->getSeasonsList();
        $selectedSeasonId = $request->query('season', 'season-4');

        // Verify valid season
        $seasonExists = collect($seasons)->firstWhere('id', $selectedSeasonId);
        if (!$seasonExists) {
            $selectedSeasonId = 'season-4';
            $seasonExists = $seasons[0];
        }

        $user = $request->user();
        $allRacers = $this->generateSeasonRacers($selectedSeasonId, $user);

        // Filters
        $search = trim($request->query('search', ''));
        $tierFilter = $request->query('tier', 'all');
        $trackFilter = $request->query('track', 'all');

        $filtered = collect($allRacers);

        if ($search !== '') {
            $filtered = $filtered->filter(function ($r) use ($search) {
                return stripos($r['name'], $search) !== false 
                    || stripos($r['vehicle'], $search) !== false 
                    || stripos($r['country'], $search) !== false;
            });
        }

        if ($tierFilter !== 'all') {
            $filtered = $filtered->filter(fn($r) => strtolower($r['tier']) === strtolower($tierFilter));
        }

        if ($trackFilter !== 'all') {
            $filtered = $filtered->filter(fn($r) => strtolower($r['track']) === strtolower($trackFilter));
        }

        $filteredRacers = $filtered->values()->all();

        // Top 3 Podium for this season
        $podium = array_slice($allRacers, 0, 3);

        // Find current user's entry if present
        $currentUserRank = collect($allRacers)->firstWhere('is_current_user', true);

        return Inertia::render('Leaderboard/Index', [
            'seasons' => $seasons,
            'currentSeason' => $seasonExists,
            'selectedSeasonId' => $selectedSeasonId,
            'podium' => $podium,
            'racers' => $filteredRacers,
            'totalParticipants' => count($allRacers),
            'currentUserRank' => $currentUserRank,
            'filters' => [
                'search' => $search,
                'tier' => $tierFilter,
                'track' => $trackFilter,
            ],
        ]);
    }
}
