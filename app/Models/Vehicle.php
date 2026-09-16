<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'class_type',
        'description',
        'image_url',
        'primary_color',
        'base_speed',
        'base_handling',
        'base_acceleration',
        'base_nitro',
        'price',
        'unlocked_by_default',
    ];

    protected function casts(): array
    {
        return [
            'base_speed' => 'integer',
            'base_handling' => 'integer',
            'base_acceleration' => 'integer',
            'base_nitro' => 'integer',
            'price' => 'decimal:2',
            'unlocked_by_default' => 'boolean',
        ];
    }

    public function skins(): HasMany
    {
        return $this->hasMany(Skin::class);
    }

    public function userVehicles(): HasMany
    {
        return $this->hasMany(UserVehicle::class);
    }
}
