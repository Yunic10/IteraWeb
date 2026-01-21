import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: route('welcome') },
        { name: 'Tema Undangan', href: route('products.themes') },
        { name: 'Produk Cetak', href: route('products.print') },
        { name: 'FAQ', href: route('faq') },
        { name: 'Career', href: route('career') },
    ];

    return (
        <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <img src="/images/logo-company.png" alt="logo-company" />
                        </div>
                        <span className="text-xl font-black text-[#00914D] tracking-tighter">ITERA STUDIO</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                className="text-sm font-bold text-gray-600 hover:text-[#00914D] transition"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a 
                            href="https://wa.me/6285122620532" 
                            className="bg-[#00914D] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-green-100 hover:scale-105 transition active:scale-95"
                        >
                            Konsultasi Gratis
                        </a>
                    </div>

                    {/* Mobile Button */}
                    <button className="md:hidden text-[#00914D]" onClick={() => setIsOpen(!isOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-50 p-6 space-y-4 shadow-xl">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} className="block text-lg font-bold text-gray-700" onClick={() => setIsOpen(false)}>
                            {link.name}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}