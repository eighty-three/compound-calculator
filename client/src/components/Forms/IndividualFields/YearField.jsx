import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const propTypes = {
  handleChange: PropTypes.func,
  register: PropTypes.func
};

const YearField = ({ handleChange, register }) => {
  return (
    <Form.Group as={Row} controlId='years'>
      <Form.Label column sm={4}>Years</Form.Label>
      <Col sm={8}>
        <Form.Control
          type="number"
          min="0"
          max="40" // I don't want to work for more than 40 years..
          step="1"
          aria-describedby="years"
          name="years"
          onChange={handleChange}
          ref={register({ required: true })} 
        />
      </Col>
    </Form.Group>
  );
};

YearField.propTypes = propTypes;

export default YearField;
