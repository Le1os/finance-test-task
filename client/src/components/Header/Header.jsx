import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link id="home-link" to="/">
          Dashboard
        </Link>
        <Link id="favorites-link" to="/favorites">
          Favorites
        </Link>
      </nav>
    </header>
  );
};

export default Header;
