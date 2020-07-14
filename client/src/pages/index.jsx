import React, { useState } from 'react';
import Head from 'next/head';

import Layout, { siteTitle } from '@/components/Layout';

import CurrenciesContext from '@/lib/CurrenciesContext';
import ComputeModes from '@/components/ComputeModes';
import CurrencyRates from '@/components/CurrencyRates';
import { getRates } from '@/lib/rates';

export default function Home({ rates }) {
  const [ currencies, setCurrencies ] = useState({ 
    input: { ...rates[0] },
    result: { ...rates[0] }
  });

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <CurrenciesContext.Provider value={currencies}>
          <ComputeModes />
        </CurrenciesContext.Provider>

        <CurrencyRates 
          rates={rates} 
          currencies={currencies}
          setCurrencies={setCurrencies}
        />
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const rates = await getRates();
  return {
    props: {
      rates
    }
  };
}
