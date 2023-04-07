import '@/styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object
};

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

App.propTypes = propTypes;
