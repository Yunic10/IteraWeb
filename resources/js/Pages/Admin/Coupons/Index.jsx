import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, coupons, products }) {
    const [editingId, setEditingId] = useState(null);
    const [showProductList, setShowProductList] = useState(false);
    const [hoveredBtn, setHoveredBtn] = useState(null);

    // Inisialisasi Form dengan min_order default 0
    const { data, setData, post, patch, processing, reset, errors } = useForm({
        code: '',
        type: 'fixed',
        value: '',
        min_order: 0, 
        is_active: true,
        product_ids: [],
    });

    const submit = (e) => {
        e.preventDefault();
        const action = editingId ? route('admin.coupons.update', editingId) : route('admin.coupons.store');
        const method = editingId ? patch : post;
        
        method(action, {
            onSuccess: () => { 
                setEditingId(null); 
                reset(); 
                setShowProductList(false); 
            },
        });
    };

    const handleEdit = (coupon) => {
        setEditingId(coupon.id);
        setData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            min_order: coupon.min_order ?? 0, // Proteksi agar tidak null
            is_active: !!coupon.is_active,
            product_ids: coupon.products.map(p => p.id),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleProduct = (id) => {
        const currentIds = [...data.product_ids];
        const newIds = currentIds.includes(id) ? currentIds.filter(i => i !== id) : [...currentIds, id];
        setData('product_ids', newIds);
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1f2937' }}>Manajemen Kupon</h2>}>
            <Head title="Kupon" />

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '15px', fontFamily: 'sans-serif' }}>
                
                {/* --- FORM INPUT (DENGAN MIN ORDER) --- */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '30px', border: '1px solid #e5e7eb' }}>
                    <form onSubmit={submit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280' }}>KODE</label>
                                <input type="text" value={data.code} onChange={e => setData('code', e.target.value.toUpperCase())} style={{ height: '40px', borderRadius: '8px', border: errors.code ? '1px solid red' : '1px solid #d1d5db', padding: '0 12px', fontSize: '14px', fontWeight: 'bold' }} required />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280' }}>TIPE</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} style={{ height: '40px', borderRadius: '8px', border: '1px solid #d1d5db', padding: '0 10px', fontSize: '14px', background: '#fff' }}>
                                    <option value="fixed">Nominal (Rp)</option>
                                    <option value="percentage">Persentase (%)</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280' }}>NILAI POTONGAN</label>
                                <input type="number" value={data.value} onChange={e => setData('value', e.target.value)} style={{ height: '40px', borderRadius: '8px', border: '1px solid #d1d5db', padding: '0 12px', fontSize: '14px' }} required />
                            </div>

                            {/* KOLOM BARU: MIN ORDER */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280' }}>MIN. ORDER (RP)</label>
                                <input type="number" value={data.min_order} onChange={e => setData('min_order', e.target.value)} style={{ height: '40px', borderRadius: '8px', border: '1px solid #d1d5db', padding: '0 12px', fontSize: '14px' }} placeholder="0" />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
                                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280' }}>BATASI PRODUK</label>
                                <div onClick={() => setShowProductList(!showProductList)} style={{ height: '40px', borderRadius: '8px', border: '1px solid #d1d5db', display: 'flex', alignItems: 'center', padding: '0 12px', cursor: 'pointer', background: '#fff', fontSize: '13px', justifyContent: 'space-between', overflow: 'hidden' }}>
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {data.product_ids.length > 0 ? `${data.product_ids.length} Dipilih` : 'Semua'}
                                    </span>
                                    <span>▼</span>
                                </div>
                                {showProductList && (
                                    <div style={{ position: 'absolute', top: '45px', left: 0, right: 0, background: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', zIndex: 100, boxShadow: '0 10px 15px rgba(0,0,0,0.1)', maxHeight: '150px', overflowY: 'auto' }}>
                                        {products.map(p => (
                                            <div key={p.id} onClick={() => toggleProduct(p.id)} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '12px', color: '#000' }}>
                                                <input type="checkbox" checked={data.product_ids.includes(p.id)} readOnly />
                                                {p.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#000' }}>
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} /> Aktif
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {editingId && (
                                    <button type="button" onClick={() => { setEditingId(null); reset(); }} style={{ padding: '8px 15px', borderRadius: '8px', background: '#f3f4f6', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
                                )}
                                <button 
                                    disabled={processing} 
                                    onMouseEnter={() => setHoveredBtn('submit')}
                                    onMouseLeave={() => setHoveredBtn(null)}
                                    style={{ padding: '10px 25px', borderRadius: '8px', background: hoveredBtn === 'submit' ? '#047857' : '#059669', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '12px', transition: '0.2s' }}
                                >
                                    {editingId ? 'UPDATE' : 'SIMPAN'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* --- GRID LIST --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
                    {coupons.map((c) => (
                        <div key={c.id} style={{ 
                            background: c.is_active ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f9fafb', 
                            color: c.is_active ? '#fff' : '#6b7280',
                            padding: '18px', borderRadius: '16px', height: '190px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: c.is_active ? 'none' : '1px solid #e5e7eb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{ fontSize: '9px', fontWeight: 'bold', opacity: 0.7 }}>KODE</p>
                                    <h4 style={{ fontSize: '18px', fontWeight: '900', margin: 0, whiteSpace: 'nowrap' }}>{c.code}</h4>
                                    <p style={{ fontSize: '9px', fontWeight: 'bold', marginTop: '4px' }}>
                                        Min. Order: Rp{(c.min_order/1000)}k
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h4 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>{c.type === 'fixed' ? `Rp${(c.value/1000)}k` : `${c.value}%`}</h4>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '8px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', height: '30px', overflow: 'hidden' }}>
                                    {c.products.length > 0 ? c.products.map(p => (
                                        <span key={p.id} style={{ fontSize: '8px', background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{p.name}</span>
                                    )) : <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Global</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEdit(c)} style={{ flex: 1, padding: '6px', borderRadius: '6px', background: '#fff', color: c.is_active ? '#059669' : '#4b5563', border: 'none', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>EDIT</button>
                                <button 
                                    onClick={() => { if(confirm('Hapus?')) router.delete(route('admin.coupons.destroy', c.id)) }} 
                                    style={{ flex: 1, padding: '6px', borderRadius: '6px', background: 'rgba(0,0,0,0.1)', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                                >HAPUS</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}