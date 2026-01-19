<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use App\Models\ThemeCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ThemeController extends Controller
{
    public function index() {
        return Inertia::render('Admin/Themes/Index', [
            'themes' => Theme::with('category')->latest()->get(),
            'categories' => ThemeCategory::all()
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'theme_category_id' => 'required|exists:theme_categories,id',
            'name' => 'required',
            'thumbnail' => 'required|image|max:2048',
            'preview_url' => 'required|url',
        ]);

        $path = $request->file('thumbnail')->store('themes/thumbnails', 'public');

        Theme::create([
            'theme_category_id' => $request->theme_category_id,
            'name' => $request->name,
            'preview_url' => $request->preview_url,
            'thumbnail_url' => $path,
            'price' => $request->price ?? 0,
            'is_premium' => $request->is_premium ?? false,
        ]);

        return back();
    }

    public function update(Request $request, Theme $theme) {
        $request->validate(['name' => 'required', 'theme_category_id' => 'required']);
        
        $data = $request->only(['name', 'theme_category_id', 'preview_url', 'price', 'is_premium']);

        if ($request->hasFile('thumbnail')) {
            if ($theme->thumbnail_url) Storage::disk('public')->delete($theme->thumbnail_url);
            $data['thumbnail_url'] = $request->file('thumbnail')->store('themes/thumbnails', 'public');
        }

        $theme->update($data);
        return back();
    }

    // --- TAMBAHKAN FUNGSI INI ---
    public function destroy(Theme $theme) {
        // Hapus file gambar dari folder storage agar tidak menumpuk
        if ($theme->thumbnail_url) {
            Storage::disk('public')->delete($theme->thumbnail_url);
        }

        // Hapus data dari database
        $theme->delete();

        return back();
    }
}