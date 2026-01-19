import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import axios from 'axios';

export default function ThemeKatalog({ themes, categories, addOns }) {
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState({ name: 'LITE', price: 49000, strike: 99000 });
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Semua');
    
    // State Kupon dari Database
    const [couponInput, setCouponInput] = useState('');
    const [couponData, setCouponData] = useState(null); // Menyimpan data kupon dari DB
    const [couponError, setCouponError] = useState('');

    const filteredThemes = useMemo(() => {
        if (activeCategory === 'Semua') return themes;
        return themes.filter(t => t.category?.name === activeCategory);
    }, [activeCategory, themes]);

    const subtotal = useMemo(() => {
        const themePrice = selectedPackage.price;
        const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
        return themePrice + addonsPrice;
    }, [selectedPackage, selectedAddons]);

    const discountAmount = useMemo(() => {
        if (!couponData) return 0;
        if (subtotal < couponData.min_order) return 0;

        if (couponData.type === 'percent') {
            return (subtotal * couponData.value) / 100;
        }
        return couponData.value;
    }, [couponData, subtotal]);

    const finalTotal = subtotal - discountAmount;

    const handleApplyCoupon = async () => {
        setCouponError('');
        try {
            const response = await axios.post('/api/validate-coupon', { code: couponInput });
            if (response.data.valid) {
                if (subtotal < response.data.min_order) {
                    setCouponError(`Minimal order Rp ${response.data.min_order.toLocaleString()} untuk kupon ini`);
                    setCouponData(null);
                } else {
                    setCouponData(response.data);
                }
            } else {
                setCouponError(response.data.message);
                setCouponData(null);
            }
        } catch (err) {
            setCouponError('Terjadi kesalahan sistem');
        }
    };

    const sendWA = () => {
        const text = `Halo Itera Studio, saya mau pesan undangan digital:\n\n- Tema: ${selectedTheme?.name}\n- Paket: ${selectedPackage.name}\n- Addons: ${selectedAddons.map(a => a.name).join(', ') || '-'}\n- Kupon: ${couponInput || '-'}\n- Diskon: Rp ${discountAmount.toLocaleString()}\n\n*Total Akhir: Rp ${finalTotal.toLocaleString()}*`;
        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
    };

    const toggleAddon = (addon) => {
        setSelectedAddons((prev) => {
            const isExist = prev.find((a) => a.id === addon.id);
            if (isExist) {
                return prev.filter((a) => a.id !== addon.id);
            }
            return [...prev, addon];
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32 lg:pb-10">
            <Head title="Katalog Tema Undangan - Itera Studio" />
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-[#00914D] mb-6 tracking-tight">Pilih Tema Favorit</h1>
                    <div className="flex flex-wrap justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {['Semua', ...categories.map(c => c.name)].map((cat) => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-[#00914D] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                    {/* KATALOG TEMA */}
                    <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                        {filteredThemes.map(theme => (
                            <div key={theme.id} onClick={() => setSelectedTheme(theme)}
                                className={`group cursor-pointer rounded-2xl overflow-hidden bg-white border-2 transition-all ${selectedTheme?.id === theme.id ? 'border-[#00914D] shadow-lg' : 'border-transparent shadow-sm'}`}
                            >
                                <div className="aspect-square overflow-hidden relative bg-gray-100">
                                    <img src={`/storage/${theme.thumbnail_url}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt={theme.name} />
                                    {selectedTheme?.id === theme.id && (
                                        <div className="absolute inset-0 bg-[#00914D]/40 flex items-center justify-center animate-fade-in text-white font-black">TERPILIH</div>
                                    )}
                                </div>
                                <div className="p-3 sm:p-4">
                                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate mb-1">{theme.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#00914D] font-black text-xs sm:text-sm">Rp {selectedPackage.price.toLocaleString()}</span>
                                        <span className="text-gray-300 line-through text-[10px]">Rp {selectedPackage.strike.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* KONFIGURASI (Sticky Desktop) */}
                    <div className="w-full lg:w-1/3 lg:sticky lg:top-24 z-10">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
                            <h3 className="font-black text-[#00914D] text-lg mb-6 flex items-center gap-2">🛒 Konfigurasi</h3>
                            
                            {/* Pilihan Paket */}
                            <div className="mb-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Paket Undangan:</label>
                                <div className="space-y-2">
                                    {[
                                        {name: 'LITE', price: 49000, strike: 99000},
                                        {name: 'PRO', price: 149000, strike: 250000},
                                        {name: 'ROYAL', price: 199000, strike: 350000}
                                    ].map(pkg => (
                                        <button key={pkg.name} onClick={() => setSelectedPackage(pkg)}
                                            className={`w-full flex justify-between items-center p-3 rounded-xl border-2 transition-all ${selectedPackage.name === pkg.name ? 'border-[#00914D] bg-green-50' : 'border-gray-50'}`}
                                        >
                                            <span className="text-xs font-bold">Paket {pkg.name}</span>
                                            <span className="text-xs font-black text-[#00914D]">Rp {pkg.price.toLocaleString()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Add-ons */}
                            <div className="mb-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Add-ons:</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                    {addOns.map(addon => {
                                        const isSelected = selectedAddons.some(a => a.id === addon.id);
                                        return (
                                            <button 
                                                key={addon.id} 
                                                type="button"
                                                onClick={() => toggleAddon(addon)}
                                                className={`w-full flex justify-between items-center p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                                                    isSelected 
                                                    ? 'border-[#00914D] bg-green-50 text-[#00914D]' 
                                                    : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {/* Checkbox visual */}
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-[#00914D] border-[#00914D]' : 'bg-white border-gray-300'}`}>
                                                        {isSelected && (
                                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-bold">{addon.name}</span>
                                                </div>
                                                <span className={`text-[11px] font-black ${isSelected ? 'text-[#00914D]' : 'text-gray-400'}`}>
                                                    +Rp {addon.price.toLocaleString()}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Kupon (Database Driven) */}
                            <div className="mb-8 pt-4 border-t border-dashed">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Voucher Promo:</label>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Masukkan kode..." value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-[#00914D]" 
                                    />
                                    <button onClick={handleApplyCoupon} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#00914D] transition">APPLY</button>
                                </div>
                                {couponError && <p className="text-[10px] text-red-500 mt-2 font-bold">{couponError}</p>}
                                {couponData && <p className="text-[10px] text-[#00914D] mt-2 font-bold">✓ Kupon "{couponInput}" Berhasil!</p>}
                            </div>

                            {/* Total Akhir (Sticky Mobile-Friendly) */}
                            <div className="hidden lg:block bg-[#00914D] p-6 rounded-[1.8rem] text-white shadow-xl shadow-green-200/50">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[10px] font-bold opacity-70 uppercase">Total Bayar</p>
                                        <h2 className="text-3xl font-black">Rp {finalTotal.toLocaleString()}</h2>
                                    </div>
                                    {discountAmount > 0 && <span className="text-[10px] bg-[#CEDE00] text-[#00914D] px-2 py-1 rounded font-black">Hemat Rp {discountAmount.toLocaleString()}</span>}
                                </div>
                                <button onClick={sendWA} disabled={!selectedTheme}
                                    className="w-full bg-[#CEDE00] text-[#00914D] py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-30"
                                >
                                    PESAN VIA WHATSAPP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY TOTAL AKHIR UNTUK MOBILE */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-[99]">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Total Akhir</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-[#00914D]">Rp {finalTotal.toLocaleString()}</span>
                            {discountAmount > 0 && <span className="text-[9px] text-red-500 line-through">Rp {subtotal.toLocaleString()}</span>}
                        </div>
                    </div>
                    <button onClick={sendWA} disabled={!selectedTheme}
                        className="bg-[#00914D] text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg shadow-green-200 disabled:opacity-30"
                    >
                        PESAN SEKARANG
                    </button>
                </div>
            </div>
        </div>
    );
}