<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use App\Models\ThemeCategory;
use App\Models\PrintProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Halaman khusus Produk Cetak
    public function printIndex()
    {
        return Inertia::render('Products/PrintProduct', [
            // Mengambil data produk dari database
            'products' => PrintProduct::all(), 
        ]);
    }

    // Halaman khusus Tema Undangan
    public function themeIndex()
    {
        return Inertia::render('Products/ThemeKatalog', [
            'themes' => Theme::with('category')->get(),
            'categories' => ThemeCategory::all(),
            // Add-ons disamakan dengan Welcome.jsx
            'addOns' => [
                ['id' => 1, 'name' => 'Sat set 24 Jam', 'price' => 50000],
                ['id' => 2, 'name' => 'Sat set instant 12 Jam', 'price' => 100000],
                ['id' => 3, 'name' => 'QR Checkin System', 'price' => 300000],
                ['id' => 4, 'name' => 'Whatsapp Blast', 'price' => 200000],
                ['id' => 5, 'name' => 'Instagram Filter Game', 'price' => 60000],
                ['id' => 6, 'name' => 'Custom Domain .com', 'price' => 300000],
                ['id' => 7, 'name' => 'Instagram Story Animasi', 'price' => 40000],
                ['id' => 8, 'name' => 'Custom Domain my.id', 'price' => 50000],
            ]
        ]);
    }

    public function validateCoupon(Request $request) {
        $coupon = \App\Models\Coupon::where('code', $request->code)
                    ->where('is_active', true)
                    ->first();

        if (!$coupon) {
            return response()->json(['valid' => false, 'message' => 'Kupon tidak ditemukan atau tidak aktif']);
        }

        return response()->json([
            'valid' => true,
            'type' => $coupon->type, // 'fixed' atau 'percent'
            'value' => $coupon->value,
            'min_order' => $coupon->min_order
        ]);
    }
}