import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/execom', label: 'Execom' },
  { to: '/contact', label: 'Contact Us' },
] as const;

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.mark} aria-hidden="true">
            CS
          </div>
          <span className={styles.name}>CSCP-CET</span>
        </div>

        <nav aria-label="Primary" className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
