import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const propTypes = {
  handleChange: PropTypes.func,
  register: PropTypes.func
};

const RateField = ({ handleChange, register }) => {
  return (
    <Form.Group as={Row} controlId='rate'>
      <Form.Label column sm={4}>Interest (%)</Form.Label>
      <Col sm={8}>
        <Form.Control
          type="number"
          min="0"
          max="100"
          step=".1"
          aria-describedby="rate"
          name="rate"
          onChange={handleChange}
          ref={register({ required: true })} 
        />
      </Col>
    </Form.Group>
  );
};

RateField.propTypes = propTypes;

export default RateField;
