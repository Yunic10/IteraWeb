import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, products }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        sku: '',
        unit: 'Pcs',
        price: '',
        original_price: '',
        image: null,
    });

    // Fungsi pembantu untuk menentukan URL gambar yang benar
    const renderImage = (path) => {
        if (!path) return 'https://via.placeholder.com/150';
        if (path.startsWith('http')) return path; // Jika placeholder
        return `/storage/${path}`; // Jika file lokal
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const submitStore = (e) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            onSuccess: () => {
                reset();
                setPreviewImage(null);
            },
        });
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setPreviewImage(renderImage(product.image_url));

        setData({
            name: product.name || '',
            sku: product.sku || '',
            unit: product.unit || 'Pcs',
            price: product.price || '',
            original_price: product.original_price || '',
            image: null, // Reset input file agar tidak mengirim path string lama
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        // Laravel spoofing: POST dengan _method patch agar file terkirim
        router.post(route('admin.products.update', editingProduct.id), {
            _method: 'patch',
            ...data,
        }, {
            forceFormData: true,
            onSuccess: () => {
                setEditingProduct(null);
                reset();
                setPreviewImage(null);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl text-gray-800">Manajemen Produk</h2>}>
            <Head title="Admin - Produk" />

            <div className="py-8 px-4 max-w-7xl mx-auto space-y-6">
                
                {/* --- FORM TAMBAH --- */}
                <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">Tambah Produk Baru</h3>
                    <form onSubmit={submitStore} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold uppercase text-gray-400">Nama Produk</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" required />
                            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">SKU</label>
                            <input type="text" value={data.sku} onChange={e => setData('sku', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Satuan</label>
                            <select value={data.unit} onChange={e => setData('unit', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm">
                                <option value="Pcs">Pcs</option>
                                <option value="Set">Set</option>
                                <option value="Meter">Meter</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Harga Jual</label>
                            <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Harga Coret</label>
                            <input type="number" value={data.original_price} onChange={e => setData('original_price', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-bold uppercase text-gray-400">Foto</label>
                            <div className="flex items-center gap-2">
                                <input type="file" onChange={handleFileChange} className="w-full text-xs" accept="image/*" />
                                {previewImage && !editingProduct && <img src={previewImage} className="w-8 h-8 object-cover rounded" />}
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button disabled={processing} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm">
                                {processing ? 'Proses...' : 'SIMPAN PRODUK'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- TABEL DAFTAR --- */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="p-4 text-center w-20">Foto</th>
                                <th className="p-4">Informasi Produk</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 text-center">
                                        <img 
                                            src={renderImage(p.image_url)} 
                                            className="w-12 h-12 object-cover rounded-lg border mx-auto shadow-sm" 
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{p.name}</div>
                                        <div className="text-[10px] text-gray-400">{p.sku || 'No SKU'} • <span className="text-blue-500">{p.unit}</span></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-green-600 font-bold">Rp {parseInt(p.price).toLocaleString()}</div>
                                        {p.original_price && <div className="text-gray-400 text-[10px] line-through">Rp {parseInt(p.original_price).toLocaleString()}</div>}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openEdit(p)} className="text-blue-600 font-bold hover:underline mr-4">EDIT</button>
                                        <button onClick={() => { if(confirm('Hapus produk ini?')) router.delete(route('admin.products.destroy', p.id)) }} className="text-red-500 font-bold hover:underline">HAPUS</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL EDIT --- */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Edit Data Produk</h3>
                        <form onSubmit={submitUpdate} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Produk</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-lg border-gray-300" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Harga</label>
                                    <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full rounded-lg border-gray-300" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Harga Coret</label>
                                    <input type="number" value={data.original_price} onChange={e => setData('original_price', e.target.value)} className="w-full rounded-lg border-gray-300" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Ganti Foto</label>
                                <div className="flex items-center gap-4 mt-1">
                                    <input type="file" onChange={handleFileChange} className="text-xs w-full" accept="image/*" />
                                    {previewImage && (
                                        <img 
                                            src={previewImage} 
                                            className="w-14 h-14 object-cover rounded-lg border" 
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => { setEditingProduct(null); setPreviewImage(null); }} className="px-4 py-2 text-sm text-gray-500 font-bold">BATAL</button>
                                <button disabled={processing} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                                    {processing ? 'Menyimpan...' : 'UPDATE DATA'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}