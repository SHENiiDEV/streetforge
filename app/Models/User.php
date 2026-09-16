<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'surname',
        'email',
        'phone',
        'dob',
        'street',
        'city',
        'country',
        'post_code',
        'game_balance',
        'xp',
        'level',
        'avatar_color',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'dob' => 'date',
            'game_balance' => 'decimal:2',
            'xp' => 'integer',
            'level' => 'integer',
            'password' => 'hashed',
        ];
    }

    public function userVehicles(): HasMany
    {
        return $this->hasMany(UserVehicle::class);
    }

    public function activeVehicle(): HasOne
    {
        return $this->hasOne(UserVehicle::class)->where('is_active', true)->with(['vehicle', 'skin', 'upgrades']);
    }

    public function ownedSkins(): BelongsToMany
    {
        return $this->belongsToMany(Skin::class, 'user_skins');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class)->orderByDesc('created_at');
    }

    public function raceResults(): HasMany
    {
        return $this->hasMany(RaceResult::class)->orderByDesc('created_at');
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->name} {$this->surname}");
    }
}
