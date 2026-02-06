'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'mindlink-active-tab';
const HEARTBEAT_MS = 2000;
const STALE_MS = 5000;

function nowMs() {
    return Date.now();
}

function readActive() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function writeActive(payload) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
}

function clearActive(tabId) {
    try {
        const current = readActive();
        if (current && current.tabId === tabId) {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch {}
}

export default function SingleTabGuard({ children }) {
    const [blocked, setBlocked] = useState(false);
    const tabIdRef = useRef(`${nowMs()}_${Math.random().toString(36).slice(2, 8)}`);
    const heartbeatRef = useRef(null);

    useEffect(() => {
        const tabId = tabIdRef.current;

        const claim = () => {
            const current = readActive();
            const isStale = !current || nowMs() - (current.lastSeen || 0) > STALE_MS;
            if (!current || isStale || current.tabId === tabId) {
                writeActive({ tabId, lastSeen: nowMs() });
                setBlocked(false);
                return true;
            }
            setBlocked(true);
            return false;
        };

        const heartbeat = () => {
            const current = readActive();
            if (current && current.tabId === tabId) {
                writeActive({ tabId, lastSeen: nowMs() });
            } else {
                claim();
            }
        };

        const onStorage = (event) => {
            if (event.key !== STORAGE_KEY) return;
            const current = readActive();
            if (current && current.tabId !== tabId && nowMs() - (current.lastSeen || 0) <= STALE_MS) {
                setBlocked(true);
            } else {
                setBlocked(false);
            }
        };

        claim();
        heartbeatRef.current = setInterval(heartbeat, HEARTBEAT_MS);
        window.addEventListener('storage', onStorage);

        return () => {
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            window.removeEventListener('storage', onStorage);
            clearActive(tabId);
        };
    }, []);

    if (blocked) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                padding: '2rem'
            }}>
                <div style={{
                    maxWidth: '520px',
                    textAlign: 'center',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.1)'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🧠</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0F172A' }}>Another tab is already open</h1>
                    <p style={{ marginTop: '0.75rem', color: '#64748B', lineHeight: 1.6 }}>
                        MindLink+ is limited to one active tab at a time. Please use the original tab for your session.
                    </p>
                </div>
            </div>
        );
    }

    return children;
}
