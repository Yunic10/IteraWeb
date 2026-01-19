import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function Career() {
    const positions = [
        {
            title: 'Template Contributor',
            location: 'Remote / Part-time',
            type: 'Kontributor Konten',
            responsibilities: [
                'Membuat dan mengunggah template sesuai brief.',
                'Menjaga kualitas desain sesuai dengan brief yang diberikan.'
            ],
            requirements: [
                'Memiliki portofolio desain yang menarik.',
                'Terbiasa menggunakan Canva/Vista Create.',
                'Memiliki kreativitas tinggi dan perhatian terhadap detail.'
            ],
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Head title="Career" />
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <h1 className="text-3xl font-black text-gray-800 mb-6">Karir — Bergabung dengan Tim</h1>

                {positions.map((p, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                        <h2 className="text-2xl font-extrabold text-gray-800">{p.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">{p.location} • {p.type}</p>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">Tanggung Jawab</h3>
                                <ul className="list-disc list-inside text-gray-600">
                                    {p.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">Persyaratan</h3>
                                <ul className="list-disc list-inside text-gray-600">
                                    {p.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-bold text-gray-800 mb-2">Cara Melamar</h4>
                            <p className="text-gray-600">Kirim email berisi CV dan portofolio ke <a href="mailto:iteraastudio@gmail.com" className="text-[#00914D] font-bold">iteraastudio@gmail.com</a> atau via gform berikut <a href="https://bit.ly/IteraHiring" className="text-[#00914D] font-bold">Itera Hiring</a>.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
