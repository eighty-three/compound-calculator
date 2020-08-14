import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { twoDecimals } from '@/lib/calculate';

const propTypes = {
  rates: PropTypes.arrayOf(
    PropTypes.shape({
      currency_name: PropTypes.string,
      rate: PropTypes.number
    })
  ),
  setCurrencies: PropTypes.func,
  currencies: PropTypes.shape({
    currency_name: PropTypes.string,
    rate: PropTypes.number
  })
};


const CurrencyRates = ({ rates, setCurrencies, currencies }) => {
  const [ mode, setMode ] = useState('input');
  const toggleMode = () => {
    (mode === 'input')
      ? setMode('result')
      : setMode('input');
  };

  const setRate = (mode, currency) => {
    setCurrencies({
      ...currencies,
      [mode]: {...currency}
    });
  };

  const modeTitle = mode.replace(/\w/, l => l.toUpperCase()); // Capitalize

  return (
    <>
      {/* Override Bootstrap styling */}
      <style type="text/css">
        {`
            .dropdown-toggle-split {
              background-color: rgb(130, 25, 25);
              border-color: rgb(130, 25, 25);
            }

            .dropdown-toggle-split:hover {
              border-color: rgb(115, 20, 20);
              background-color: rgb(115, 20, 20);
            }
        `}
      </style>

      <Dropdown as={ButtonGroup}>
        <Button onClick={toggleMode} variant="dark">
          {modeTitle}: {currencies[mode].currency_name}
        </Button>

        <Dropdown.Toggle split id="dropdown-split-basic" variant="dark"/>

        <Dropdown.Menu>
          {rates.map((currency) => {
            return (
              <Dropdown.Item 
                key={currency.currency_name}
                onClick={() =>
                  setRate(mode, { 
                    'currency_name': currency.currency_name, 
                    'rate': currency.rate 
                  })
                }
              >
                {currency.currency_name}: {twoDecimals(currency.rate)}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

CurrencyRates.propTypes = propTypes;

export default CurrencyRates;
