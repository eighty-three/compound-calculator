import React from 'react';

import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <div className="text-center">
      <p className={`${styles.title}`}><strong>Compound Calculator</strong></p>
    </div>
  );
};

export default Navbar;
