<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Upgrade extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'level',
        'speed_bonus',
        'handling_bonus',
        'accel_bonus',
        'nitro_bonus',
        'price',
        'icon',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'level' => 'integer',
            'speed_bonus' => 'integer',
            'handling_bonus' => 'integer',
            'accel_bonus' => 'integer',
            'nitro_bonus' => 'integer',
            'price' => 'decimal:2',
        ];
    }

    public function userVehicles(): BelongsToMany
    {
        return $this->belongsToMany(UserVehicle::class, 'user_vehicle_upgrades');
    }
}
