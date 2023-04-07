import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styles from '@/components/Forms/IndividualFields/GoalField.module.scss';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const propTypes = {
  handleChange: PropTypes.func,
  register: PropTypes.func
};

const GoalField = ({ handleChange, register }) => {
  const [ goal, setGoal ] = useState({ label: 'Goal (Total)', helpText: '' });
  const toggleMode = () => {
    if (goal.label === 'Goal (Total)') {
      handleChange({ target: { name: 'swr', value: true } });
      setGoal({
        label: 'Goal (4% WR)',
        helpText: 'total * .04 / 12'
      });
    } else {
      handleChange({ target: { name: 'swr', value: false } });
      setGoal({
        label: 'Goal (Total)',
        helpText: ''
      });
    }
  };

  return (
    <Form.Group as={Row} controlId='goal'>
      <Form.Label column sm={4}>
        <div onClick={toggleMode} className={`${styles.toggleLabel} ${styles.unselectable}`}>{goal.label}</div>
      </Form.Label>
      <Col sm={8}>
        <Form.Control
          type="number"
          min="0"
          step="1"
          aria-describedby="goal"
          name="goal"
          placeholder={goal.helpText}
          onChange={handleChange}
          ref={register({ required: true })} 
        />
      </Col>
    </Form.Group>
  );
};

GoalField.propTypes = propTypes;

export default GoalField;
