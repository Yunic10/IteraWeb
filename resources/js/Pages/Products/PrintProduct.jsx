import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import axios from 'axios';

export default function PrintProduct({ products = [] }) {
    // 1. Logika State
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [length, setLength] = useState(1);
    const [width, setWidth] = useState(1);

    const [couponInput, setCouponInput] = useState('');
    const [couponData, setCouponData] = useState(null);
    const [couponError, setCouponError] = useState('');
    
    // State untuk kontrol panel konfigurasi di Mobile
    const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

    // 2. Logika Tambah Keranjang
    const addToCart = () => {
        if (!selectedProduct) return;
        const isMeter = selectedProduct.unit?.toLowerCase() === 'meter';
        const priceCalculation = isMeter 
            ? selectedProduct.price * length * width 
            : selectedProduct.price;

        const newItem = {
            cartId: Date.now(),
            id: selectedProduct.id,
            name: selectedProduct.name,
            qty: parseInt(qty),
            dimensions: isMeter ? `${length}x${width}m` : null,
            totalPrice: priceCalculation * qty
        };

        setCart([...cart, newItem]);
        setQty(1);
    };

    // 3. Logika Kalkulasi Total
    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);
    
    const discountAmount = useMemo(() => {
        if (!couponData || subtotal < couponData.min_order) return 0;
        return couponData.type === 'percent' ? (subtotal * couponData.value) / 100 : couponData.value;
    }, [couponData, subtotal]);

    const finalTotal = Math.max(0, subtotal - discountAmount);

    const handleApplyCoupon = async () => {
        setCouponError('');
        try {
            const response = await axios.post('/api/validate-coupon', { code: couponInput });
            if (response.data.valid) {
                if (subtotal < response.data.min_order) {
                    setCouponError(`Min. order Rp ${response.data.min_order.toLocaleString()}`);
                } else { setCouponData(response.data); }
            } else { setCouponError(response.data.message); }
        } catch (err) { setCouponError('Kupon tidak valid'); }
    };

    const sendWA = () => {
        const detail = cart.map(i => `- ${i.name} ${i.dimensions ? `(${i.dimensions})` : ''} x${i.qty}`).join('\n');
        const text = `Halo Itera Studio, saya pesan:\n\n${detail}\n\n*Total: Rp ${finalTotal.toLocaleString()}*`;
        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
    };

    const removeFromCart = (cartId) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    // Fungsi klik produk (otomatis buka panel di mobile)
    const selectProductMobile = (product) => {
        setSelectedProduct(product);
        setIsMobilePanelOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Head title="Katalog Produk Cetak" />
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* KATALOG (KIRI) */}
                    <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {products?.map((product) => (
                            <div key={product.id} onClick={() => selectProductMobile(product)}
                                className={`cursor-pointer rounded-2xl overflow-hidden bg-white border-2 transition ${selectedProduct?.id === product.id ? 'border-[#00914D] shadow-md' : 'border-transparent'}`}
                            >
                                <div className="aspect-square bg-gray-100">
                                    <img src={`/storage/${product.image_url}`} className="w-full h-full object-cover" alt={product.name} />
                                </div>
                                <div className="p-3">
                                    <h4 className="text-[11px] font-bold truncate">{product.name}</h4>
                                    <p className="text-[#00914D] font-black text-xs">Rp {product.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* KALKULATOR DESKTOP (STICKY) */}
                    <div className="hidden lg:block w-full lg:w-1/3 lg:sticky lg:top-24 z-10">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl overflow-y-auto max-h-[85vh] custom-scrollbar">
                            <OrderConfiguration 
                                selectedProduct={selectedProduct}
                                length={length} setLength={setLength}
                                width={width} setWidth={setWidth}
                                qty={qty} setQty={setQty}
                                addToCart={addToCart}
                                cart={cart}
                                setCart={setCart}
                                removeFromCart={removeFromCart}
                                couponInput={couponInput}
                                setCouponInput={setCouponInput}
                                handleApplyCoupon={handleApplyCoupon}
                                couponError={couponError}
                                couponData={couponData}
                                subtotal={subtotal}
                                discountAmount={discountAmount}
                                finalTotal={finalTotal}
                                sendWA={sendWA}
                                isMobile={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY BOTTOM MOBILE PANEL (MODAL/SHEET) */}
            <div className={`lg:hidden fixed inset-0 z-[100] transition-all duration-300 ${isMobilePanelOpen ? 'visible' : 'invisible'}`}>
                <div className={`absolute inset-0 bg-black/40 transition-opacity ${isMobilePanelOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobilePanelOpen(false)} />
                <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-6 shadow-2xl transition-transform duration-300 transform ${isMobilePanelOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" onClick={() => setIsMobilePanelOpen(false)} />
                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <OrderConfiguration 
                            selectedProduct={selectedProduct}
                            length={length} setLength={setLength}
                            width={width} setWidth={setWidth}
                            qty={qty} setQty={setQty}
                            addToCart={addToCart}
                            cart={cart}
                            setCart={setCart}
                            removeFromCart={removeFromCart}
                            couponInput={couponInput}
                            setCouponInput={setCouponInput}
                            handleApplyCoupon={handleApplyCoupon}
                            couponError={couponError}
                            couponData={couponData}
                            subtotal={subtotal}
                            discountAmount={discountAmount}
                            finalTotal={finalTotal}
                            sendWA={sendWA}
                            isMobile={true}
                        />
                    </div>
                </div>
            </div>

            {/* STICKY BUTTON BAR (MOBILE) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] z-[90]">
                <div className="flex justify-between items-center gap-4">
                    <div onClick={() => setIsMobilePanelOpen(true)} className="cursor-pointer">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total Pesanan ({cart.length})</p>
                        <p className="text-xl font-black text-[#00914D]">Rp {finalTotal.toLocaleString()}</p>
                    </div>
                    <button onClick={() => cart.length > 0 ? sendWA() : setIsMobilePanelOpen(true)}
                        className="bg-[#00914D] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all">
                        {cart.length > 0 ? 'PESAN WA' : 'LIHAT KERANJANG'}
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #00914D; border-radius: 10px; }
            `}} />
        </div>
    );
}

// KOMPONEN KONFIGURASI (Dipakai di Desktop & Mobile agar sinkron)
function OrderConfiguration({ 
    selectedProduct, length, setLength, width, setWidth, qty, setQty, addToCart,
    cart, setCart, removeFromCart, couponInput, setCouponInput, handleApplyCoupon, 
    couponError, couponData, subtotal, discountAmount, finalTotal, sendWA, isMobile 
}) {
    return (
        <div className="space-y-4">
            <h3 className="font-black text-[#00914D] uppercase text-xs tracking-widest">Konfigurasi Pesanan</h3>
            
            {selectedProduct ? (
                <div className="space-y-4 animate-fade-in">
                    <div className="p-3 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0 border">
                            <img src={`/storage/${selectedProduct.image_url}`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-gray-800 leading-tight">{selectedProduct.name}</p>
                            <p className="text-[10px] text-[#00914D] font-bold">Rp {selectedProduct.price.toLocaleString()} / {selectedProduct.unit}</p>
                        </div>
                    </div>

                    {selectedProduct.unit?.toLowerCase() === 'meter' ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Panjang (m)</label>
                                    <input type="number" step="0.1" value={length} onChange={e => setLength(e.target.value)} className="w-full rounded-xl border-gray-100 bg-gray-50 text-sm font-bold focus:ring-[#00914D]" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Lebar (m)</label>
                                    <input type="number" step="0.1" value={width} onChange={e => setWidth(e.target.value)} className="w-full rounded-xl border-gray-100 bg-gray-50 text-sm font-bold focus:ring-[#00914D]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Jumlah Lembar (Qty)</label>
                                <div className="flex items-center gap-2">
                                    <input type="number" value={qty} onChange={e => setQty(e.target.value)} className="flex-1 rounded-xl border-gray-100 bg-gray-50 text-sm font-bold focus:ring-[#00914D]" />
                                    <button onClick={addToCart} className="bg-[#00914D] text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-black transition">+ KERANJANG</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Jumlah Pesanan ({selectedProduct.unit})</label>
                            <div className="flex items-center gap-2">
                                <input type="number" value={qty} onChange={e => setQty(e.target.value)} className="flex-1 rounded-xl border-gray-100 bg-gray-50 text-sm font-bold focus:ring-[#00914D]" />
                                <button onClick={addToCart} className="bg-[#00914D] text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-black transition">+ KERANJANG</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-6 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                    <p className="text-[10px] text-gray-400 font-bold italic uppercase tracking-widest leading-relaxed">Pilih Produk <br/> di Katalog</p>
                </div>
            )}

            {/* List Keranjang (Tampil di Mobile & Desktop) */}
            {cart.length > 0 && (
                <div className="mt-6 pt-4 border-t border-dashed">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Item Keranjang:</p>
                        <button onClick={() => setCart([])} className="text-[9px] font-black text-red-400 hover:text-red-600 uppercase transition">Kosongkan</button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {cart.map(item => (
                            <div key={item.cartId} className="flex flex-col bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:border-red-100 transition-all">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-700 text-[10px] leading-tight flex-1 pr-4">
                                        {item.qty}x {item.name} {item.dimensions && `(${item.dimensions})`}
                                    </span>
                                    <span className="font-black text-[#00914D] text-[10px]">Rp {item.totalPrice.toLocaleString()}</span>
                                </div>
                                <button onClick={() => removeFromCart(item.cartId)} className="text-[9px] font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition w-fit">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Hapus Item
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Kupon & Total */}
            <div className="mt-6 pt-4 border-t border-dashed">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Voucher Diskon:</label>
                <div className="flex gap-2">
                    <input type="text" placeholder="KODE..." value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-[#00914D]" />
                    <button onClick={handleApplyCoupon} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold">APPLY</button>
                </div>
                {couponError && <p className="text-[10px] text-red-500 mt-2 font-bold">{couponError}</p>}
                {couponData && <p className="text-[10px] text-[#00914D] mt-2 font-bold">✓ Kupon Berhasil!</p>}
                
                {/* Total Akhir (Hanya tampil di Desktop atau sebagai info di mobile panel) */}
                <div className="mt-6 bg-[#00914D] p-5 rounded-[1.8rem] text-white">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-[10px] font-bold opacity-70 uppercase mb-1 leading-none">Total Bayar</p>
                            <h2 className="text-2xl font-black">Rp {finalTotal.toLocaleString()}</h2>
                        </div>
                        {discountAmount > 0 && <span className="text-[10px] bg-[#CEDE00] text-[#00914D] px-2 py-1 rounded font-black">-Rp {discountAmount.toLocaleString()}</span>}
                    </div>
                    {/* Tombol Pesan di Desktop, di Mobile juga muncul di dalam panel sebagai alternatif */}
                    <button onClick={sendWA} disabled={cart.length === 0} className="w-full bg-[#CEDE00] text-[#00914D] py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30">
                        PESAN VIA WHATSAPP
                    </button>
                </div>
            </div>
        </div>
    );
}