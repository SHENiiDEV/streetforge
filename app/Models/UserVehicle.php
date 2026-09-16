<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UserVehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'skin_id',
        'current_speed',
        'current_handling',
        'current_acceleration',
        'current_nitro',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'current_speed' => 'integer',
            'current_handling' => 'integer',
            'current_acceleration' => 'integer',
            'current_nitro' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function skin(): BelongsTo
    {
        return $this->belongsTo(Skin::class);
    }

    public function upgrades(): BelongsToMany
    {
        return $this->belongsToMany(Upgrade::class, 'user_vehicle_upgrades')->withTimestamps();
    }

    public function recalculateStats(): void
    {
        $this->loadMissing(['vehicle', 'upgrades']);
        $speed = $this->vehicle->base_speed;
        $handling = $this->vehicle->base_handling;
        $accel = $this->vehicle->base_acceleration;
        $nitro = $this->vehicle->base_nitro;

        foreach ($this->upgrades as $upg) {
            $speed += $upg->speed_bonus;
            $handling += $upg->handling_bonus;
            $accel += $upg->accel_bonus;
            $nitro += $upg->nitro_bonus;
        }

        $this->update([
            'current_speed' => $speed,
            'current_handling' => min(100, $handling),
            'current_acceleration' => min(100, $accel),
            'current_nitro' => min(100, $nitro),
        ]);
    }
}
