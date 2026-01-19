import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { url, props } = usePage();
    
    const authUser = user || props.auth.user;

    if (!authUser) return null;

    // Helper untuk style link aktif (Warna Hijau)
    const getNavLinkStyle = (path, exact = false) => {
        const isActive = exact ? url === path : url.startsWith(path);
        return `flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive 
            ? 'bg-green-600 text-white shadow-lg shadow-green-200 font-bold' 
            : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
        }`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* --- SIDEBAR DESKTOP --- */}
            <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200 shadow-sm z-50">
                <div className="flex items-center justify-center h-20 border-b border-gray-100">
                    <Link href="/">
                        <ApplicationLogo className="block h-10 w-auto fill-current text-green-600" />
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase px-4 mb-4 tracking-wider">Main Menu</p>
                    
                    <Link href={route('dashboard')} className={getNavLinkStyle('/dashboard', true)}>
                        Dashboard
                    </Link>

                    <Link href={route('admin.products.index')} className={getNavLinkStyle('/admin/products')}>
                        Produk Cetak
                    </Link>

                    <p className="text-xs font-semibold text-gray-400 uppercase px-4 mt-6 mb-4 tracking-wider">Digital Themes</p>

                    <Link href={route('admin.theme-categories.index')} className={getNavLinkStyle('/admin/theme-categories')}>
                        Kategori Tema
                    </Link>

                    <Link href={route('admin.themes.index')} className={getNavLinkStyle('/admin/themes')}>
                        Daftar Tema
                    </Link>

                    <p className="text-xs font-semibold text-gray-400 uppercase px-4 mt-6 mb-4 tracking-wider">Marketing</p>

                    <Link href={route('admin.coupons.index')} className={getNavLinkStyle('/admin/coupons')}>
                        Manajemen Kupon
                    </Link>
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold uppercase">
                            {authUser.name ? authUser.name.charAt(0) : 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{authUser.name}</p>
                            <p className="text-xs text-gray-500 truncate">{authUser.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 md:ms-64 flex flex-col min-h-screen">
                <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 h-16 flex items-center px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between w-full items-center">
                        <div className="flex items-center">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="md:hidden p-2 rounded-md text-gray-400 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <span className="hidden md:block font-medium text-gray-500 italic border-l-2 border-green-500 ps-3">IteraWeb Panel v1.0</span>
                        </div>

                        <div className="flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center text-sm font-medium text-gray-500 hover:text-green-600 transition">
                                        {authUser.name}
                                        <svg className="ms-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </nav>

                {/* Mobile Navigation Dropdown */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden bg-white border-b border-gray-200'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link href={route('dashboard')} className="block px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600">Dashboard</Link>
                        <Link href={route('admin.products.index')} className="block px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600">Produk Cetak</Link>
                        <Link href={route('admin.theme-categories.index')} className="block px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600">Kategori Tema</Link>
                        <Link href={route('admin.themes.index')} className="block px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600">Daftar Tema</Link>
                        <Link href={route('admin.coupons.index')} className="block px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600">Manajemen Kupon</Link>
                    </div>
                </div>

                {header && (
                    <header className="bg-white shadow-sm border-b border-gray-200">
                        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 font-bold text-green-800">
                            {header}
                        </div>
                    </header>
                )}

                <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}