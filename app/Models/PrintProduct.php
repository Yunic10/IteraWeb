<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PrintProduct extends Model
{
    protected $guarded = [];
    public function coupons()
    {
        // Tambahkan 'coupon_product' sebagai argumen kedua
        return $this->belongsToMany(Coupon::class, 'coupon_product');
    }
}
