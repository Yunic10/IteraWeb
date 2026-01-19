<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'type', 'value', 'min_order', 'is_active'];

    // WAJIB ADA: Agar Coupon::with('products') di Controller bisa jalan
    public function products()
    {
        return $this->belongsToMany(PrintProduct::class, 'coupon_print_product', 'coupon_id', 'print_product_id');
    }
}