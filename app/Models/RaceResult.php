<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RaceResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'race_track_id',
        'user_vehicle_id',
        'position',
        'race_time_seconds',
        'best_lap_seconds',
        'reward_currency',
        'reward_xp',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'race_time_seconds' => 'decimal:2',
            'best_lap_seconds' => 'decimal:2',
            'reward_currency' => 'decimal:2',
            'reward_xp' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function raceTrack(): BelongsTo
    {
        return $this->belongsTo(RaceTrack::class);
    }

    public function userVehicle(): BelongsTo
    {
        return $this->belongsTo(UserVehicle::class);
    }
}
