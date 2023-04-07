import React from 'react';
import PropTypes from 'prop-types';

import Table from 'react-bootstrap/Table';

const propTypes = {
  progression: PropTypes.arrayOf(PropTypes.number),
  currencies: PropTypes.shape({
    input: PropTypes.shape({
      currency_name: PropTypes.string,
      rate: PropTypes.number
    }),
    result: PropTypes.shape({
      currency_name: PropTypes.string,
      rate: PropTypes.number
    })
  })
};

const GrowthTable = ({ progression, currencies }) => {
  return (
    <>
      {(progression.length > 1) &&
      <Table striped bordered>
        <thead>
          <tr>
            <th>Year</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {progression.map((amount, index) => {
            const convertedAmount = new Intl.NumberFormat('en-US', 
              { style: 'currency', currency: currencies.result.currency_name })
              .format(amount / currencies.input.rate * currencies.result.rate);

            return (
              <tr key={index}>
                <td>{index}</td>
                <td>{convertedAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      }
    </>
  );
};

GrowthTable.propTypes = propTypes;

export default GrowthTable;
