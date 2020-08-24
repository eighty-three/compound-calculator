import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from './Layout.module.css';

import Navbar from '@/components/Navbar';

export const siteTitle = 'Compound Calculator';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ])
};

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      {/* Meta Tags */}
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='Compound Calculator'
        />
      </Head>
      
      {/* Contents */}
      <main>
        <Navbar />
        {children}
      </main>
    </div>
  );
}

Layout.propTypes = propTypes;
