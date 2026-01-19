<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ThemeCategory extends Model
{
    protected $guarded = [];

    /**
     * Relasi: Satu kategori memiliki banyak Tema.
     */
    public function themes(): HasMany
    {
        return $this->hasMany(Theme::class, 'theme_category_id');
    }
}
