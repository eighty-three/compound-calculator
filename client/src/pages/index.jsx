import React, { useState } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import Layout, { siteTitle } from '@/components/Layout';

import CurrenciesContext from '@/lib/CurrenciesContext';
import ComputeModes from '@/components/ComputeModes';
import CurrencyRates from '@/components/CurrencyRates';
import { getRates } from '@/lib/rates';

const propTypes = {
  rates: PropTypes.arrayOf(
    PropTypes.shape({
      currency_name: PropTypes.string,
      rate: PropTypes.number
    })
  )
};

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

Home.propTypes = propTypes;

export async function getServerSideProps() {
  const rates = await getRates();
  return {
    props: {
      rates
    }
  };
}
