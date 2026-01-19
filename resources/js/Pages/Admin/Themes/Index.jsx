import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, themes, categories }) {
    const [editingTheme, setEditingTheme] = useState(null);
    const [previewThumbnail, setPreviewThumbnail] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        theme_category_id: '',
        preview_url: '',
        price: 0,
        is_premium: false,
        thumbnail: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('thumbnail', file);
            setPreviewThumbnail(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingTheme) {
            router.post(route('admin.themes.update', editingTheme.id), {
                _method: 'patch',
                ...data,
            }, {
                forceFormData: true,
                onSuccess: () => { setEditingTheme(null); reset(); setPreviewThumbnail(null); },
            });
        } else {
            post(route('admin.themes.store'), {
                forceFormData: true,
                onSuccess: () => { reset(); setPreviewThumbnail(null); },
            });
        }
    };

    const openEdit = (theme) => {
        setEditingTheme(theme);
        setPreviewThumbnail(`/storage/${theme.thumbnail_url}`);
        setData({
            name: theme.name || '',
            theme_category_id: theme.theme_category_id || '',
            preview_url: theme.preview_url || '',
            price: theme.price || 0,
            is_premium: !!theme.is_premium,
            thumbnail: null,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl text-gray-800">Manajemen Tema</h2>}>
            <Head title="Admin - Tema" />

            <div className="py-8 px-4 max-w-7xl mx-auto space-y-6">
                {/* Form Container */}
                <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">{editingTheme ? 'Edit Tema' : 'Tambah Tema Baru'}</h3>
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4 md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Nama Tema</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Kategori</label>
                                    <select value={data.theme_category_id} onChange={e => setData('theme_category_id', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" required>
                                        <option value="">Pilih Kategori</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400">URL Preview</label>
                                <input type="url" value={data.preview_url} onChange={e => setData('preview_url', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" placeholder="https://demo.com/tema-1" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Harga (Rp)</label>
                                    <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" />
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <input type="checkbox" id="premium" checked={data.is_premium} onChange={e => setData('is_premium', e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                                    <label htmlFor="premium" className="text-sm font-bold text-gray-700 italic">Tandai sebagai Premium</label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400">Thumbnail Tema</label>
                                <input type="file" onChange={handleFileChange} className="w-full text-xs mt-1" accept="image/*" />
                                {previewThumbnail && (
                                    <div className="mt-2 relative group">
                                        <img src={previewThumbnail} className="w-full h-32 object-cover rounded-lg border shadow-inner" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition rounded-lg"></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button disabled={processing} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                    {processing ? 'Saving...' : 'SIMPAN TEMA'}
                                </button>
                                {editingTheme && (
                                    <button type="button" onClick={() => { setEditingTheme(null); reset(); setPreviewThumbnail(null); }} className="bg-gray-100 px-4 rounded-lg font-bold text-gray-500">X</button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Grid List Tema */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {themes.map((t) => (
                        <div key={t.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="relative">
                                <img src={`/storage/${t.thumbnail_url}`} className="w-full h-40 object-cover" />
                                {!!t.is_premium && (
                                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">PREMIUM</span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="text-[10px] font-bold text-blue-500 uppercase">{t.category?.name}</div>
                                <h4 className="font-bold text-gray-800 truncate">{t.name}</h4>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm font-bold text-green-600">
                                        {t.price > 0 ? `Rp ${parseInt(t.price).toLocaleString()}` : 'FREE'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(t)} className="p-1.5 bg-gray-50 text-blue-600 rounded-lg hover:bg-blue-50 border">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => { if(confirm('Hapus tema?')) router.delete(route('admin.themes.destroy', t.id)) }} className="p-1.5 bg-gray-50 text-red-500 rounded-lg hover:bg-red-50 border">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}