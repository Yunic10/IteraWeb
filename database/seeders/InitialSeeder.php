<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ThemeCategory;
use App\Models\Theme;
use App\Models\Coupon;
use App\Models\PrintProduct;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class InitialSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin (Untuk Login Dashboard)
        $admin = User::create([
            'name' => 'Admin Utama',
            'email' => 'admin@mail.com',
            'password' => Hash::make('password123'),
        ]);

        // 2. Buat Kategori Tema
        $wedding = ThemeCategory::create([
            'name' => 'Wedding',
            'slug' => 'wedding',
            'description' => 'Koleksi tema undangan pernikahan eksklusif',
        ]);

        $aqiqah = ThemeCategory::create([
            'name' => 'Aqiqah',
            'slug' => 'aqiqah',
            'description' => 'Tema undangan aqiqah yang lucu dan ceria',
        ]);

        // 3. Buat Tema Undangan
        Theme::create([
            'theme_category_id' => $wedding->id,
            'name' => 'Royal Gold',
            'preview_url' => 'https://demo.anda.com/royal-gold',
            'thumbnail_url' => 'https://via.placeholder.com/300x400',
            'price' => 50000,
            'is_premium' => true,
        ]);

        // 4. Buat Produk Cetak
        $produkHardcover = PrintProduct::create([
            'name' => 'Undangan Hardcover Foil Gold',
            'sku' => 'PRT-001',
            'unit' => 'Pcs',
            'price' => 7500,
            'original_price' => 10000,
            'image_url' => 'https://via.placeholder.com/400x400',
        ]);

        $produkSoftcover = PrintProduct::create([
            'name' => 'Undangan Softcover Simpel',
            'sku' => 'PRT-002',
            'unit' => 'Pcs',
            'price' => 2500,
            'original_price' => 3500,
            'image_url' => 'https://via.placeholder.com/400x400',
        ]);

        // 5. Buat Kupon - Skenario A (Kupon Khusus Produk Tertentu)
        $kuponSpesifik = Coupon::create([
            'code' => 'KHUSUS_HARDCOVER',
            'type' => 'fixed',
            'value' => 2000, // Potongan 2000 rupiah
            'min_order' => 100000,
            'is_active' => true,
        ]);

        // HUBUNGKAN KUPON KE PRODUK (Tabel Pivot)
        // Kupon 'KHUSUS_HARDCOVER' hanya bisa digunakan untuk 'Undangan Hardcover'
        $kuponSpesifik->products()->attach($produkHardcover->id);

        // 6. Buat Kupon - Global (Bisa untuk semua produk)
        $kuponGlobal = Coupon::create([
            'code' => 'DISKON_MEMBER',
            'type' => 'percentage',
            'value' => 10, // Potongan 10%
            'min_order' => 50000,
            'is_active' => true,
        ]);
        // Jika tidak di-attach ke produk manapun, logic kita nanti menganggapnya berlaku global
    }
}