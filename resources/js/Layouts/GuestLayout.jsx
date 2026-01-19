import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 pt-6 sm:justify-center sm:pt-0">
            <div className="text-center">
                <Link href="/">
                    <ApplicationLogo className="h-24 w-24 mx-auto" />
                </Link>
                <h1 className="mt-3 text-xl font-black text-[#00914D]">Itera Studio</h1>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-6 shadow-md sm:max-w-md sm:rounded-xl">
                {children}
            </div>
        </div>
    );
}
