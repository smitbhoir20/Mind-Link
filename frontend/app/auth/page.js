'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { getBackendUrl } from '@/lib/backendUrl';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem('mindlink-token');
        if (token) {
            // Verify token
            const backendUrl = getBackendUrl();

            fetch(`${backendUrl}/api/auth/verify`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.valid) {
                        router.push('/');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('mindlink-token');
                });
        }
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const backendUrl = getBackendUrl();

        try {
            if (isLogin) {
                // Login
                const response = await fetch(`${backendUrl}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
                }

                // Save token and user data
                localStorage.setItem('mindlink-token', data.token);
                localStorage.setItem('mindlink-user', JSON.stringify(data.user));

                console.log('✅ Login successful');
                router.push('/');

            } else {
                // Register
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                const response = await fetch(`${backendUrl}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        phone: formData.phone,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Registration failed');
                }

                // Save token and user data
                localStorage.setItem('mindlink-token', data.token);
                localStorage.setItem('mindlink-user', JSON.stringify(data.user));

                console.log('✅ Registration successful');
                router.push('/');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🧠</span>
                        <span className={styles.logoText}>MindLink+</span>
                    </div>
                    <h1 className={styles.title}>
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h1>
                    <p className={styles.subtitle}>
                        {isLogin
                            ? 'Sign in to continue your wellness journey'
                            : 'Join our supportive mental wellness community'}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className={styles.tabSwitcher}>
                    <button
                        className={`${styles.tab} ${isLogin ? styles.active : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Sign In
                    </button>
                    <button
                        className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={styles.error}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Form */}
                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                required={!isLogin}
                                minLength={3}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="phone">Phone Number (Optional)</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder={isLogin ? "Enter your password" : "Create a password"}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required={!isLogin}
                                minLength={6}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className={styles.footer}>
                    {isLogin ? (
                        <>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign up</button></>
                    ) : (
                        <>Already have an account? <button onClick={() => setIsLogin(true)}>Sign in</button></>
                    )}
                </p>
            </div>
        </div>
    );
}
