'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getBackendUrl } from '@/lib/backendUrl';

// Pages that don't require authentication
const publicPaths = ['/auth'];

export default function AuthGuard({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check if current path is public
        if (publicPaths.includes(pathname)) {
            setIsLoading(false);
            setIsAuthenticated(true);
            return;
        }

        // Check for auth token
        const token = localStorage.getItem('mindlink-token');
        const user = localStorage.getItem('mindlink-user');

        if (!token || !user) {
            // Not logged in, redirect to auth page
            router.push('/auth');
            return;
        }

        // Verify token with backend (optional but recommended)
        const backendUrl = getBackendUrl();

        fetch(`${backendUrl}/api/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.valid) {
                    setIsAuthenticated(true);
                } else {
                    // Token invalid, clear and redirect
                    localStorage.removeItem('mindlink-token');
                    localStorage.removeItem('mindlink-user');
                    router.push('/auth');
                }
            })
            .catch(() => {
                // If backend unavailable, trust the local token
                setIsAuthenticated(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [pathname, router]);

    // Show loading while checking auth
    if (isLoading && !publicPaths.includes(pathname)) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid #E2E8F0',
                        borderTopColor: '#8B5CF6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ color: '#64748B', fontWeight: 500 }}>Loading...</p>
                    <style jsx>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : null;
}
