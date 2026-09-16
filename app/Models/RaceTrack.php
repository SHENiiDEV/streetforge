<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RaceTrack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'theme',
        'difficulty',
        'laps',
        'length_meters',
        'reward_currency_1st',
        'reward_currency_2nd',
        'reward_currency_3rd',
        'reward_xp_1st',
        'reward_xp_2nd',
        'reward_xp_3rd',
        'description',
        'track_data',
    ];

    protected function casts(): array
    {
        return [
            'laps' => 'integer',
            'length_meters' => 'integer',
            'reward_currency_1st' => 'decimal:2',
            'reward_currency_2nd' => 'decimal:2',
            'reward_currency_3rd' => 'decimal:2',
            'reward_xp_1st' => 'integer',
            'reward_xp_2nd' => 'integer',
            'reward_xp_3rd' => 'integer',
            'track_data' => 'array',
        ];
    }

    public function raceResults(): HasMany
    {
        return $this->hasMany(RaceResult::class);
    }
}
