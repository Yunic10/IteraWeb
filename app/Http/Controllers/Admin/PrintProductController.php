<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrintProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PrintProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/PrintProducts/Index', [
            'products' => PrintProduct::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric',
            'unit'  => 'required',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'sku', 'unit', 'price', 'original_price']);

        if ($request->hasFile('image')) {
            $data['image_url'] = $request->file('image')->store('products', 'public');
        }

        PrintProduct::create($data);
        return back();
    }

    public function update(Request $request, PrintProduct $product)
    {
        // Parameter di route adalah 'products', maka di sini harus $product atau cocokan rutenya
        $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric',
            'unit'  => 'required',
            'image' => 'nullable|image|max:2048',
        ]);

        $updateData = $request->only(['name', 'sku', 'unit', 'price', 'original_price']);

        if ($request->hasFile('image')) {
            // Hapus file lama jika ada dan bukan link internet (placeholder)
            if ($product->image_url && !str_starts_with($product->image_url, 'http')) {
                Storage::disk('public')->delete($product->image_url);
            }
            $updateData['image_url'] = $request->file('image')->store('products', 'public');
        }

        $product->update($updateData);
        return back();
    }

    public function destroy(PrintProduct $product)
    {
        if ($product->image_url && !str_starts_with($product->image_url, 'http')) {
            Storage::disk('public')->delete($product->image_url);
        }
        $product->delete();
        return back();
    }
}