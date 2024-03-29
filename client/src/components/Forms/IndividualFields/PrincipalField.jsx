import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const propTypes = {
  handleChange: PropTypes.func,
  register: PropTypes.func
};

const PrincipalField = ({ handleChange, register, label }) => {
  return (
    <Form.Group as={Row} controlId='principal'>
      <Form.Label column sm={4}>{label || 'Principal'}</Form.Label>
      <Col sm={8}>
        <Form.Control
          type="number"
          min="0"
          step="1"
          aria-describedby="principal"
          name="principal"
          onChange={handleChange}
          ref={register({ required: true })} 
        />
      </Col>
    </Form.Group>
  );
};

PrincipalField.propTypes = propTypes;

export default PrincipalField;
