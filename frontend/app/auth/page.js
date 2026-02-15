'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { getBackendUrl } from '@/lib/backendUrl';
import Icon from '@/components/Icon';

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
    const [emailStatus, setEmailStatus] = useState({ state: 'idle', message: '' });
    const [usernameStatus, setUsernameStatus] = useState({ state: 'idle', message: '' });
    const router = useRouter();

    // Check availability as user types
    useEffect(() => {
        if (isLogin || !formData.email || formData.email.length < 5) {
            setEmailStatus({ state: 'idle', message: '' });
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const backendUrl = getBackendUrl();
                const response = await fetch(`${backendUrl}/api/auth/check-email?email=${encodeURIComponent(formData.email)}`);
                const data = await response.json();
                if (data.available) {
                    setEmailStatus({ state: 'success', message: '' });
                } else {
                    setEmailStatus({ state: 'error', message: 'Email already registered' });
                }
            } catch (err) {
                console.error('Email check failed:', err);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.email, isLogin]);

    useEffect(() => {
        if (isLogin || !formData.username || formData.username.length < 3) {
            setUsernameStatus({ state: 'idle', message: '' });
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const backendUrl = getBackendUrl();
                const response = await fetch(`${backendUrl}/api/auth/check-username?username=${encodeURIComponent(formData.username)}`);
                const data = await response.json();
                if (data.available) {
                    setUsernameStatus({ state: 'success', message: 'Username available' });
                } else {
                    setUsernameStatus({ state: 'error', message: 'Username already taken' });
                }
            } catch (err) {
                console.error('Username check failed:', err);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.username, isLogin]);

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem('mindlink-token');
        if (token) {
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

                console.log('Login successful');
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

                console.log('Registration successful');
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
                        <span className={styles.logoIcon}>
                            <Icon name="Brain" size={32} color="white" />
                        </span>
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
                        <Icon name="AlertCircle" size={16} /> {error}
                    </div>
                )}

                {/* Form */}
                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={`${styles.inputGroup} ${usernameStatus.state === 'error' ? styles.error : ''} ${usernameStatus.state === 'success' ? styles.success : ''}`}>
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
                            {usernameStatus.message && (
                                <div className={`${styles.availability} ${styles[usernameStatus.state]}`}>
                                    {usernameStatus.message}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`${styles.inputGroup} ${emailStatus.state === 'error' ? styles.error : ''} ${emailStatus.state === 'success' ? styles.success : ''}`}>
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
                        {!isLogin && emailStatus.message && (
                            <div className={`${styles.availability} ${styles[emailStatus.state]}`}>
                                {emailStatus.message}
                            </div>
                        )}
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
                            <Icon name="Loader2" size={20} className="animate-spin" />
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className={styles.footer}>
                    {isLogin ? (
                        <>Don&apos;t have an account? <button onClick={() => setIsLogin(false)}>Sign up</button></>
                    ) : (
                        <>Already have an account? <button onClick={() => setIsLogin(true)}>Sign in</button></>
                    )}
                </p>
            </div>
        </div>
    );
}
