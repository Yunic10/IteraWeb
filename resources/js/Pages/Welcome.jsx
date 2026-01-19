import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import PricingCard from '@/Components/PricingCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
            <Head title="Itera Studio - Digital & Print" />
            
            <Navbar />

            {/* --- HERO SLIDER SECTION --- */}
        <section className="bg-white overflow-hidden"> {/* Tambahkan overflow-hidden */}
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect={'fade'}
                fadeEffect={{ crossFade: true }} // PENTING: Agar slide lama benar-benar hilang saat slide baru masuk
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 10000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                autoHeight={true} // Menyesuaikan tinggi secara otomatis
                className="mySwiper w-full"
            >
                {/* SLIDE 1: PRODUK CETAK */}
                <SwiperSlide className="w-full bg-white">
                    <div className="max-w-6xl mx-auto px-6 py-14 sm:py-24 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 text-left">
                            <div className="inline-block px-4 py-1.5 bg-lime-50 text-[#00914D] rounded-full text-xs font-bold mb-6">
                                Premium Printing Service
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-black text-[#00914D] leading-tight">
                                Pesan Online <br /> <span className="text-[#CEDE00]">Produk Sampai Depan Pintu</span>
                            </h1>
                            <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-lg">
                                Dari kartu nama, brosur, hingga banner besar. Hitung harga otomatis dan pesan langsung melalui sistem katalog kami.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link href="/products/print" className="px-8 py-4 bg-[#00914D] text-white font-black rounded-2xl text-center shadow-lg shadow-green-100 hover:scale-105 transition">
                                    Buka Katalog Cetak
                                </Link>
                                <a href="https://wa.me/6281234567890" className="px-8 py-4 border-2 border-[#00914D] text-[#00914D] font-black rounded-2xl text-center hover:bg-gray-50 transition">
                                    Konsultasi Desain
                                </a>
                            </div>
                        </div>
                        {/* Gambar Slide 1 */}
                        <div className="flex-1 w-full flex justify-center lg:justify-end">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#00914D] to-black rounded-3xl blur opacity-20"></div>
                                <img src="/images/hero-print.png" alt="Print Products" className="relative w-[300px] sm:w-[400px] h-auto rounded-3xl shadow-2xl" />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                {/* SLIDE 2: UNDANGAN DIGITAL */}
                <SwiperSlide className="w-full bg-white">
                    <div className="max-w-6xl mx-auto px-6 py-14 sm:py-24 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 text-left">
                            <div className="inline-block px-4 py-1.5 bg-green-50 text-[#00914D] rounded-full text-xs font-bold mb-6">
                                #1 Undangan Digital
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-black text-[#00914D] leading-tight">
                                Undangan Digital <br /> <span className="text-[#CEDE00]">Indah & Cepat</span>
                            </h1>
                            <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-lg">
                                Template responsif, RSVP real-time, musik kustom, dan dukungan domain sendiri. Kirim ke ribuan tamu hanya dengan satu klik.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <a href="#themes" className="px-8 py-4 bg-[#CEDE00] text-[#00914D] font-black rounded-2xl text-center shadow-lg shadow-lime-100 hover:scale-105 transition">
                                    Lihat Demo
                                </a>
                                <a href="#pricing" className="px-8 py-4 bg-[#00914D] text-white font-black rounded-2xl text-center shadow-lg shadow-green-100 hover:scale-105 transition">
                                    Cek Paket Harga
                                </a>
                            </div>
                        </div>
                        {/* Gambar Slide 2 */}
                        <div className="flex-1 w-full flex justify-center lg:justify-end">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#CEDE00] to-[#00914D] rounded-3xl blur opacity-25"></div>
                                <img src="/images/hero-digital.png" alt="Digital Invitation" className="relative w-[300px] sm:w-[400px] h-auto rounded-3xl shadow-2xl" />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                
            </Swiper>
        </section>

            {/* --- CSS Kustom untuk Pagination (Opsional) --- */}
            <style dangerouslySetInnerHTML={{ __html: `
                .swiper-pagination-bullet-active {
                    background: #00914D !important;
                }
            `}} />

            {/* --- FEATURES SECTION --- */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-[#00914D]">Features</h2>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Fast Loading', desc: 'Optimized for speed and performance.' },
                        { title: 'Custom Domain', desc: 'Use your own domain for the invitation.' },
                        { title: 'Music Player', desc: 'Add background music to your invitations.' },
                        { title: 'RSVP', desc: 'Manage guest responses easily.' }
                    ].map((feature, i) => (
                        <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl hover:border-[#00914D] transition shadow-sm">
                            <h3 className="font-bold text-gray-800">{feature.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- PRICING SECTION (PAKET HARGA) --- */}
            <section id="pricing" className="bg-neutral-50 py-16 border-y border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-[#00914D]">Paket & Harga</h2>
                    <p className="mt-2 text-gray-600">Pilih paket yang sesuai kebutuhan Anda — semua dirancang untuk undangan digital yang cepat dan elegan.</p>

                    <div className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-3">
                        <PricingCard 
                            title="Paket LITE (DIY)" 
                            price={49000} 
                            features={["Bebas Konsultasi", "Bebas Custom", "Background music custom", "Amplop/Kado Digital", "Google Maps", "Gallery Foto", "Hitung mundur", "Custom Domain"]} 
                        />
                        <PricingCard 
                            title="Paket PRO (Eksklusif)" 
                            price={149000} 
                            highlight={true}
                            features={["Bebas Konsultasi", "Bebas Custom", "Background music custom", "Amplop/Kado Digital", "Google Maps", "QR Checkin Sederhana", "Gallery Foto", "Hitung mundur", "Custom Domain", "Filter Story Instagram (Statis)"]} 
                        />
                        <PricingCard 
                            title="Paket ROYAL (Ultimate)" 
                            price={199000} 
                            features={["Semua fitur PRO", "Filter Story Instagram (Statis & Bergerak)", "Filter Story Instagram (Game)", "Custom Domain .com/.id (Opsional)", "Prioritas Support"]} 
                        />
                    </div>

                    {/* --- ADD-ONS SECTION --- */}
                    <div id="addons" className="mt-20">
                        <h3 className="text-xl font-bold text-gray-800">Paket Tambahan (Add-ons)</h3>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { n: "Sat set 24 Jam", p: "50K" },
                                { n: "Sat set instant 12 Jam", p: "100K" },
                                { n: "QR Checkin System", p: "300K" },
                                { n: "Whatsapp Blast", p: "200K" },
                                { n: "Instagram Filter Game", p: "60K" },
                                { n: "Custom Domain .com", p: "300K" },
                                { n: "Instagram Story Animasi", p: "40K" },
                                { n: "Custom Domain my.id", p: "50K" }
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-xl border border-gray-200 bg-white flex justify-between items-center shadow-sm hover:border-[#00914D] transition">
                                    <span className="text-sm font-medium text-gray-700">{item.n}</span>
                                    <strong className="text-[#00914D]">{item.p}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION ---
            <section id="faq" className="max-w-6xl mx-auto px-6 py-20">
                <h2 className="text-2xl font-bold text-[#00914D]">FAQ</h2>
                <div className="mt-8 grid gap-4 max-w-3xl">
                    <details className="group p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900 list-none">
                            <h3 className="font-bold text-gray-800">Bisakah saya menggunakan domain sendiri?</h3>
                            <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <p className="mt-4 leading-relaxed text-gray-600 text-sm">
                            Ya, dukungan custom domain (seperti namamu.com) tersedia pada paket Pro dan Royal dengan biaya tambahan registrasi domain.
                        </p>
                    </details>

                    <details className="group p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900 list-none">
                            <h3 className="font-bold text-gray-800">Apakah fitur RSVP sudah termasuk?</h3>
                            <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <p className="mt-4 leading-relaxed text-gray-600 text-sm">
                            Tentu! Semua paket kami sudah dilengkapi dengan sistem RSVP digital yang terintegrasi untuk memudahkan pendataan tamu Anda secara real-time.
                        </p>
                    </details>
                </div>
            </section> */}

            {/* --- FOOTER --- */}
            <footer className="bg-white border-t border-gray-100 py-10 text-center">
                <p className="text-gray-400 text-sm">© 2026 Itera Studio. All rights reserved.</p>
            </footer>
        </div>
    );
}