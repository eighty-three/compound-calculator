import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  statusCode: PropTypes.number,
  error: PropTypes.string
};

export default function Custom404({statusCode, error}) {
  return (
    statusCode
      ? <h1>{statusCode} - {error}</h1>
      : <h1>404 - Not Found</h1>
  );
}

Custom404.propTypes = propTypes;
