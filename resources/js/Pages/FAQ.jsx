import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function FAQ() {
    const faqs = [
        { q: 'Apa itu Itera Studio?', a: 'Itera Studio adalah layanan cetak profesional yang menyediakan berbagai produk cetak berkualitas tinggi. Serta menyediakan layanan desain dan konfigurasi produk sesuai kebutuhan pelanggan.' },
        { q: 'Bagaimana cara memesan?', a: 'Pilih produk, atur konfigurasi, lalu kirim pesanan via WhatsApp.' },
        { q: 'Metode pembayaran apa yang tersedia?', a: 'Kita menerima pembayaran cash maupun online (QRIS/transfer)' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Head title="FAQ" />
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <h1 className="text-3xl font-black text-gray-800 mb-6">FAQ — Pertanyaan yang Sering Diajukan</h1>

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-lg text-gray-800 mb-2">{item.q}</h3>
                            <p className="text-gray-600">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
