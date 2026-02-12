/**
 * Returns the backend URL.
 * - In production, uses NEXT_PUBLIC_BACKEND_URL environment variable.
 * - In development, falls back to http://<current hostname>:5000.
 */
export function getBackendUrl() {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    if (typeof window !== 'undefined') {
        return `http://${window.location.hostname}:5000`;
    }
    return 'http://localhost:5000';
}
