import React, { useState, useMemo } from 'react';

export default function PrintSimulator({ products }) {
    const [items, setItems] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');

    const addItem = () => {
        const product = products.find(p => p.id == selectedProductId);
        if (!product) return;

        const newItem = {
            id: Math.random().toString(36).slice(2, 9),
            product_id: product.id,
            name: product.name,
            price: product.price, // Harga per m2 atau per unit
            type: product.category, // Misal: 'Cetak' (m2) atau 'Aksesoris' (unit)
            width: 1,
            height: 1,
            qty: 1
        };
        setItems([...items, newItem]);
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(it => it.id === id ? { ...it, [field]: value } : it));
    };

    const removeItem = (id) => setItems(items.filter(it => it.id !== id));

    const total = useMemo(() => {
        return items.reduce((sum, it) => {
            const itemTotal = it.type === 'Cetak' 
                ? (it.width * it.height * it.price * it.qty) 
                : (it.price * it.qty);
            return sum + itemTotal;
        }, 0);
    }, [items]);

    const sendWA = () => {
        const lines = items.map((it, i) => (
            `${i+1}. ${it.name} ${it.type === 'Cetak' ? `(${it.width}mx${it.height}m)` : ''} x${it.qty} = Rp${(it.type === 'Cetak' ? it.width*it.height*it.price*it.qty : it.price*it.qty).toLocaleString()}`
        ));
        const text = `Halo Itera Studio, saya mau pesan produk cetak:\n\n${lines.join('\n')}\n\n*Total: Rp ${total.toLocaleString()}*`;
        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-[#00914D] mb-4">Kalkulator Produk Cetak</h3>
            
            <div className="flex gap-2 mb-6">
                <select 
                    value={selectedProductId} 
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 border-gray-200 rounded-xl text-sm"
                >
                    {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Rp{p.price.toLocaleString()})</option>
                    ))}
                </select>
                <button onClick={addItem} className="bg-[#00914D] text-white px-6 py-2 rounded-xl font-bold text-sm">Tambah</button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
                {items.map((it) => (
                    <div key={it.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                        <button onClick={() => removeItem(it.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                        <p className="font-bold text-sm text-gray-800 mb-2">{it.name}</p>
                        
                        <div className="flex items-center gap-3">
                            {it.type === 'Cetak' && (
                                <>
                                    <input type="number" value={it.width} onChange={(e) => updateItem(it.id, 'width', e.target.value)} className="w-16 p-1 text-xs border-gray-200 rounded" placeholder="L(m)" />
                                    <span className="text-gray-400">x</span>
                                    <input type="number" value={it.height} onChange={(e) => updateItem(it.id, 'height', e.target.value)} className="w-16 p-1 text-xs border-gray-200 rounded" placeholder="P(m)" />
                                </>
                            )}
                            <input type="number" value={it.qty} onChange={(e) => updateItem(it.id, 'qty', e.target.value)} className="ml-auto w-16 p-1 text-xs border-gray-200 rounded" placeholder="Qty" />
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="text-center text-gray-400 text-sm py-10">Belum ada produk dipilih</p>}
            </div>

            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 font-medium">Estimasi Total</span>
                    <span className="text-2xl font-black text-[#00914D]">Rp {total.toLocaleString()}</span>
                </div>
                <button 
                    disabled={items.length === 0}
                    onClick={sendWA}
                    className="w-full py-4 bg-[#CEDE00] text-[#00914D] font-bold rounded-2xl shadow-lg hover:shadow-[#CEDE00]/50 transition-all disabled:opacity-50"
                >
                    Pesan via WhatsApp
                </button>
            </div>
        </div>
    );
}