<?php

namespace App\Http\Controllers;

use App\Models\RaceResult;
use App\Models\RaceTrack;
use App\Models\User;
use App\Models\UserVehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RaceController extends Controller
{
    public function lobby(Request $request): Response
    {
        $user = $request->user();

        $tracks = RaceTrack::all();
        $activeCar = UserVehicle::where('user_id', $user->id)
            ->where('is_active', true)
            ->with(['vehicle', 'skin', 'upgrades'])
            ->first();

        $recentResults = RaceResult::where('user_id', $user->id)
            ->with('raceTrack')
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        // Build global championship leaderboard from top drivers
        $topResults = RaceResult::with(['user', 'raceTrack', 'userVehicle.vehicle'])
            ->orderBy('best_lap_seconds', 'asc')
            ->take(15)
            ->get();

        $leaderboard = $topResults->map(function ($res, $index) use ($user) {
            return [
                'rank' => $index + 1,
                'is_current_user' => $res->user_id === $user->id,
                'user_name' => $res->user->name . ($res->user->surname ? ' ' . substr($res->user->surname, 0, 1) . '.' : ''),
                'country' => $res->user->country ?? 'Global',
                'level' => $res->user->level ?? 1,
                'avatar_color' => $res->user->avatar_color ?? '#06b6d4',
                'vehicle_name' => $res->userVehicle?->vehicle?->name ?? 'Apex Pulse GT',
                'track_name' => $res->raceTrack?->name ?? 'Grand Prix',
                'best_lap' => number_format((float) $res->best_lap_seconds, 2) . 's',
                'total_time' => number_format((float) $res->race_time_seconds, 2) . 's',
                'rating_mmr' => 1200 + ($res->user->level * 45) + (15 - $index) * 20,
            ];
        });

        // Competitive racer bot profiles for dynamic race matchmaking grid
        $opponentsPool = [
            ['name' => 'ShadowDrifter', 'car' => 'Apex Formula Proto 01', 'color' => '#3b82f6', 'skill' => 0.98, 'country' => '🇩🇪 Germany'],
            ['name' => 'Klaus_V8', 'car' => 'Titan Venom V8', 'color' => '#ef4444', 'skill' => 0.95, 'country' => '🇦🇹 Austria'],
            ['name' => 'Yuki_Drift99', 'car' => 'Shinobi Horizon GTR', 'color' => '#10b981', 'skill' => 0.94, 'country' => '🇯🇵 Japan'],
            ['name' => 'Elena_Cyber', 'car' => 'Cyber Hyperion X', 'color' => '#a855f7', 'skill' => 0.96, 'country' => '🇨🇾 Cyprus'],
            ['name' => 'Apex_Stig', 'car' => 'Phantom Eclipse GT', 'color' => '#eab308', 'skill' => 0.97, 'country' => '🇸🇪 Sweden'],
            ['name' => 'NightRider_US', 'car' => 'Titan Venom V8', 'color' => '#f97316', 'skill' => 0.92, 'country' => '🇺🇸 USA'],
            ['name' => 'TurboMax_FR', 'car' => 'Vortex Shadow R', 'color' => '#06b6d4', 'skill' => 0.90, 'country' => '🇫🇷 France'],
            ['name' => 'DriftQueen_PL', 'car' => 'Drift King S15', 'color' => '#f43f5e', 'skill' => 0.93, 'country' => '🇵🇱 Poland'],
            ['name' => 'Marco_Monza', 'car' => 'Phantom Eclipse GT', 'color' => '#ec4899', 'skill' => 0.91, 'country' => '🇮🇹 Italy'],
        ];

        return Inertia::render('Race/Lobby', [
            'tracks' => $tracks,
            'activeCar' => $activeCar,
            'recentResults' => $recentResults,
            'leaderboard' => $leaderboard,
            'opponentsPool' => $opponentsPool,
        ]);
    }

    public function submitResult(Request $request, RaceTrack $track): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'position' => ['required', 'integer', 'min:1', 'max:8'],
            'race_time_seconds' => ['required', 'numeric', 'min:5'],
            'best_lap_seconds' => ['nullable', 'numeric'],
            'user_vehicle_id' => ['nullable', 'exists:user_vehicles,id'],
        ]);

        $position = $validated['position'];

        $rewardCurrency = match ($position) {
            1 => (float) $track->reward_currency_1st,
            2 => (float) $track->reward_currency_2nd,
            3 => (float) $track->reward_currency_3rd,
            default => 35.00, // Participation consolation prize
        };

        $rewardXp = match ($position) {
            1 => (int) $track->reward_xp_1st,
            2 => (int) $track->reward_xp_2nd,
            3 => (int) $track->reward_xp_3rd,
            default => 25,
        };

        // Create race result record
        $result = RaceResult::create([
            'user_id' => $user->id,
            'race_track_id' => $track->id,
            'user_vehicle_id' => $validated['user_vehicle_id'] ?? $user->activeVehicle?->id,
            'position' => $position,
            'race_time_seconds' => $validated['race_time_seconds'],
            'best_lap_seconds' => $validated['best_lap_seconds'],
            'reward_currency' => $rewardCurrency,
            'reward_xp' => $rewardXp,
        ]);

        // Award currency & XP
        $user->increment('game_balance', $rewardCurrency);
        $user->increment('xp', $rewardXp);

        // Level calculation: every 250 XP = 1 Level
        $newLevel = max(1, (int) floor($user->xp / 250) + 1);
        if ($newLevel > $user->level) {
            $user->update(['level' => $newLevel]);
        }

        return response()->json([
            'status' => 'success',
            'result' => $result,
            'rewards' => [
                'currency' => $rewardCurrency,
                'xp' => $rewardXp,
                'new_balance' => (float) $user->fresh()->game_balance,
                'new_xp' => (int) $user->fresh()->xp,
                'new_level' => (int) $user->fresh()->level,
            ],
        ]);
    }
}
