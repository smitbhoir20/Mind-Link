'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';

// Pages that should not show navbar
const noNavbarPaths = ['/auth'];

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const showNavbar = !noNavbarPaths.includes(pathname);

    return (
        <AuthGuard>
            {showNavbar && <Navbar />}
            <main>{children}</main>
        </AuthGuard>
    );
}
