<?php

use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\PrintProductController;
use App\Http\Controllers\Admin\CouponController; 
use App\Http\Controllers\Admin\ThemeCategoryController;
use App\Http\Controllers\Admin\ThemeController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

// API untuk validasi kupon
Route::post('/api/validate-coupon', [App\Http\Controllers\ProductController::class, 'validateCoupon']);

// Halaman Produk Cetak & Kalkulatornya
Route::get('/produk-cetak', [ProductController::class, 'printIndex'])->name('products.print');

// Halaman Tema Undangan & Kalkulatornya
Route::get('/tema-undangan', [ProductController::class, 'themeIndex'])->name('products.themes');

// Halaman FAQ (Publik)
Route::get('/faq', function () {
    return Inertia::render('FAQ');
})->name('faq');

// Halaman Career (Publik)
Route::get('/career', function () {
    return Inertia::render('Career');
})->name('career');

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Bungkus semua rute yang butuh login di sini
Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. Dashboard Utama
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // 3. Profile User (Bawaan Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Kelompokkan semua yang berawalan /admin dan nama admin.
    Route::prefix('admin')->name('admin.')->group(function () {
        
        // Rute Produk
        Route::resource('products', PrintProductController::class)->except(['create', 'edit', 'show']);
        
        // Rute Coupon (Ini akan otomatis jadi admin.coupons.index, admin.coupons.store, dll)
        Route::resource('coupons', CouponController::class);
        
        // Rute Tema dan Kategori Tema
        Route::resource('theme-categories', ThemeCategoryController::class);
        Route::resource('themes', ThemeController::class);
    });
});

require __DIR__.'/auth.php';