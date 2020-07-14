import React from 'react';
import Head from 'next/head';

import styles from './Layout.module.css';

import Navbar from '@/components/Navbar';

export const siteTitle = 'Compound Calculator';

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


