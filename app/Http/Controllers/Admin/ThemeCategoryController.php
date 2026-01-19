<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ThemeCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ThemeCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ThemeCategories/Index', [
            'categories' => ThemeCategory::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:theme_categories,name',
            'description' => 'nullable|string',
        ]);

        ThemeCategory::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $request->description,
        ]);

        return back()->with('message', 'Kategori tema berhasil dibuat');
    }

    // --- INI FUNGSI UPDATE YANG ANDA CARI ---
    public function update(Request $request, ThemeCategory $themeCategory)
    {
        $validated = $request->validate([
            // Abaikan ID kategori ini sendiri saat pengecekan unique
            'name' => 'required|string|max:255|unique:theme_categories,name,' . $themeCategory->id,
            'description' => 'nullable|string',
        ]);

        $themeCategory->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $request->description,
        ]);

        return back()->with('message', 'Kategori tema berhasil diperbarui');
    }

    public function destroy(ThemeCategory $themeCategory)
    {
        // Secara otomatis Theme yang terhubung akan terhapus jika migrasi menggunakan ->onDelete('cascade')
        $themeCategory->delete();
        return back()->with('message', 'Kategori tema dihapus');
    }
}