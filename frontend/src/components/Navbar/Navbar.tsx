import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/execom', label: 'Execom' },
  { to: '/contact', label: 'Contact Us' },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.mark} aria-hidden="true">
            CS
          </div>
          <span className={styles.name}>CYBER SECURITY AND COMPETITIVE PROGRAMMING CLUB</span>
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>

        <nav
          aria-label="Primary"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              end={item.to === '/'}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
