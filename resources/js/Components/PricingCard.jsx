import React from 'react';

export default function PricingCard({ title, price, features, highlight = false }) {
    const handleOrder = () => {
        const message = `Halo Itera Studio, saya ingin memesan *${title}* seharga *Rp ${price.toLocaleString()}*. Mohon informasi langkah selanjutnya.`;
        const phone = "6285122620532"; // Ganti dengan nomor WA Anda
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className={`p-8 rounded-2xl border flex flex-col transition-all duration-300 ${highlight ? 'border-primary shadow-2xl scale-105 z-10 bg-white' : 'border-gray-200 bg-white'}`}>
            {highlight && (
                <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full self-start mb-4">PALING POPULER</span>
            )}
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-black text-primary">Rp {price.toLocaleString()}</span>
                <span className="text-gray-500 text-sm ml-1">/event</span>
            </div>
            
            <ul className="mt-6 space-y-3 flex-1">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-600">
                        <svg className="w-5 h-5 text-primary mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                        {f}
                    </li>
                ))}
            </ul>

            <button 
                onClick={handleOrder}
                className={`mt-8 w-full py-3 rounded-xl font-bold transition-all ${highlight ? 'bg-primary text-white hover:bg-green-800' : 'bg-accent text-primary hover:opacity-80'}`}
            >
                Pilih Paket Ini
            </button>
        </div>
    );
}