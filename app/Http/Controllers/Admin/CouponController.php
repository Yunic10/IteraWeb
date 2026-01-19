<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\PrintProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => Coupon::with('products')->latest()->get(),
            'products' => PrintProduct::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:coupons,code',
            'type' => 'required',
            'value' => 'required|numeric',
            'min_order' => 'nullable|numeric', // Izinkan null di validasi
            'is_active' => 'required|boolean',
            'product_ids' => 'nullable|array',
        ]);

        $coupon = Coupon::create($validated);

        if ($request->has('product_ids')) {
            $coupon->products()->sync($request->product_ids);
        }

        return redirect()->back()->with('message', 'Kupon berhasil dibuat');
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => 'required|unique:coupons,code,' . $coupon->id,
            'type' => 'required',
            'value' => 'required|numeric',
            'min_order' => 'nullable|numeric', // Izinkan null di validasi
            'is_active' => 'required|boolean',
            'product_ids' => 'nullable|array',
        ]);

        // Jika min_order kosong dari frontend, paksa jadi 0 agar SQL tidak error
        $validated['min_order'] = $request->min_order ?? 0;

        $coupon->update($validated);

        // Update relasi produk
        if ($request->has('product_ids')) {
            $coupon->products()->sync($request->product_ids);
        } else {
            $coupon->products()->detach();
        }

        return redirect()->back()->with('message', 'Kupon diperbarui');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return back()->with('message', 'Kupon berhasil dihapus!');
    }
}