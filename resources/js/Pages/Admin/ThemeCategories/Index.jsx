import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, categories }) {
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, patch, processing, reset, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            patch(route('admin.theme-categories.update', editingCategory.id), {
                onSuccess: () => { setEditingCategory(null); reset(); },
            });
        } else {
            post(route('admin.theme-categories.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const openEdit = (cat) => {
        setEditingCategory(cat);
        setData({
            name: cat.name || '',
            description: cat.description || '',
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl text-gray-800">Kategori Tema</h2>}>
            <Head title="Admin - Kategori Tema" />

            <div className="py-8 px-4 max-w-5xl mx-auto space-y-6">
                {/* Form Tambah/Edit */}
                <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">
                        {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                    </h3>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400">Nama Kategori</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" placeholder="Contoh: Wedding" required />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400">Deskripsi (Opsional)</label>
                                <input type="text" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" placeholder="Penjelasan singkat..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            {editingCategory && (
                                <button type="button" onClick={() => { setEditingCategory(null); reset(); }} className="px-4 py-2 text-sm font-bold text-gray-500">BATAL</button>
                            )}
                            <button disabled={processing} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition text-sm">
                                {editingCategory ? 'UPDATE KATEGORI' : 'SIMPAN KATEGORI'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabel Daftar */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b text-gray-500 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="p-4">Nama Kategori</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4">Deskripsi</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-gray-800">{cat.name}</td>
                                    <td className="p-4 text-gray-500">{cat.slug}</td>
                                    <td className="p-4 text-gray-500 truncate max-w-xs">{cat.description || '-'}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openEdit(cat)} className="text-blue-600 font-bold hover:underline mr-4">EDIT</button>
                                        <button onClick={() => { if(confirm('Hapus kategori? Semua tema di dalamnya mungkin terpengaruh.')) router.delete(route('admin.theme-categories.destroy', cat.id)) }} className="text-red-500 font-bold hover:underline">HAPUS</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}