import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const propTypes = {
  handleChange: PropTypes.func,
  register: PropTypes.func
};

const MonthlyField = ({ handleChange, register }) => {
  return (
    <Form.Group as={Row} controlId="monthly">
      <Form.Label column sm={4}>Monthly</Form.Label>
      <Col sm={8}>
        <Form.Control
          type="number"
          min="0"
          max="999999"
          step="1"
          aria-describedby="monthly"
          name="monthly"
          onChange={handleChange}
          ref={register({ required: true })} 
        />
      </Col>
    </Form.Group>
  );
};

MonthlyField.propTypes = propTypes;

export default MonthlyField;
