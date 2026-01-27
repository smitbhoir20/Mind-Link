'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import ThemeSelector from './ThemeSelector';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/chat', label: 'Chat', icon: '💬' },
    { href: '/selfcare', label: 'Self-Care', icon: '🌿' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🧠</span>
          <span className={styles.logoText}>MindLink+</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Profile Dropdown */}
        <div className={styles.profileSection} ref={dropdownRef}>
          <button
            className={styles.profileButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Profile menu"
          >
            <div className={styles.avatar}>
              <span>👤</span>
            </div>
            <svg
              className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <Link href="/profile" className={styles.dropdownItem}>
                <span>👤</span> View Profile
              </Link>
              <Link href="/settings" className={styles.dropdownItem}>
                <span>⚙️</span> Settings
              </Link>
              <hr className={styles.dropdownDivider} />
              <button className={styles.dropdownItem}>
                <span>🚪</span> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <hr className={styles.mobileDivider} />
          <Link href="/profile" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
            <span>👤</span> View Profile
          </Link>
          <Link href="/settings" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
            <span>⚙️</span> Settings
          </Link>
          <button className={styles.mobileNavLink}>
            <span>🚪</span> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
