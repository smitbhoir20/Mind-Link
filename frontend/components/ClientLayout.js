'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import SingleTabGuard from '@/components/SingleTabGuard';

// Pages that should not show navbar
const noNavbarPaths = ['/auth'];

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const showNavbar = !noNavbarPaths.includes(pathname);

    return (
        <SingleTabGuard>
            <AuthGuard>
                {showNavbar && <Navbar />}
                <main>{children}</main>
            </AuthGuard>
        </SingleTabGuard>
    );
}
