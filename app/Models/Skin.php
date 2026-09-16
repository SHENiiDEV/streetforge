<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skin extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'name',
        'skin_type',
        'color_hex',
        'secondary_color_hex',
        'glow_color',
        'asset_pattern',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function owners(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_skins');
    }
}
