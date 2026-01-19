<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Theme extends Model
{
    protected $guarded = [];

    /**
     * Relasi: Tema ini dimiliki oleh sebuah Kategori.
     */
    protected $fillable = ['theme_category_id', 'name', 'preview_url', 'thumbnail_url', 'price', 'is_premium'];
    public function category(): BelongsTo
    {
        // theme_category_id secara otomatis dikenali sebagai foreign key
        return $this->belongsTo(ThemeCategory::class, 'theme_category_id');
    }
}
