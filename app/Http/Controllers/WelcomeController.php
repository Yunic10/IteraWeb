<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use App\Models\ThemeCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome', [
            // Ambil semua tema beserta kategorinya untuk Katalog & Kalkulator Tema
            'themes' => Theme::with('category')->get(),
            
            // Ambil semua kategori untuk filter di frontend
            'categories' => ThemeCategory::all(),
            
            // Data untuk Kalkulator Cetak (Bisa dibuatkan Model 'Product' jika sudah ada)
            // Jika belum ada table-nya, kita kirim manual dulu sesuai standar harga Anda
            'printProducts' => [
                [
                    'id' => 1,
                    'name' => 'Banner (260gsm)',
                    'price' => 16000,
                    'type' => 'Cetak', // Berdasarkan m2
                    'unit' => 'm²'
                ],
                [
                    'id' => 2,
                    'name' => 'Stand Banner',
                    'price' => 65000,
                    'type' => 'Aksesoris', // Berdasarkan unit
                    'unit' => 'unit'
                ],
                [
                    'id' => 3,
                    'name' => 'Undangan Softcover (Art Paper)',
                    'price' => 3500,
                    'type' => 'Aksesoris',
                    'unit' => 'pcs'
                ],
            ],

            // Data untuk Add-ons (Agar harganya bisa dikalkulasi otomatis)
            'addOns' => [
                ['id' => 'extra_24h', 'name' => 'Sat set 24 Jam', 'price' => 50000],
                ['id' => 'wa_blast', 'name' => 'WhatsApp Blast', 'price' => 200000],
                ['id' => 'ig_filter', 'name' => 'Instagram Filter Game', 'price' => 60000],
                ['id' => 'domain_com', 'name' => 'Custom Domain .com', 'price' => 300000],
            ]
        ]);
    }
}