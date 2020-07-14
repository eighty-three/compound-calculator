import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';

import CurrenciesContext from '@/lib/CurrenciesContext';
import { findYears } from '@/lib/calculate';
import { GoalField, MonthlyField, RateField } from '@/components/Forms/IndividualFields';

const YearsForm = () => {
  const { register } = useForm({ mode: 'onBlur' });
  const [ formInputs, setFormInputs ] = useState({});
  const currencies = useContext(CurrenciesContext);

  const result = findYears({
    ...formInputs,
    goal: formInputs.goal / currencies.result.rate,
    monthly: formInputs.monthly / currencies.input.rate
  });

  const handleChange = ({ target }) => setFormInputs({ 
    ...formInputs, 
    [target.name]: target.value 
  });

  const fieldProps = { handleChange, register };

  return (
    <Form className="mx-auto">
      <GoalField {...fieldProps}/>
      <MonthlyField {...fieldProps}/>
      <RateField {...fieldProps}/>
      <hr />

      {(result === 1)
        ? <p>{'You could\'ve figured that out yourself'}</p>
        : <p>You need <strong>{result} years</strong> to reach your goal</p>
      }
    </Form>
  );
};

export default YearsForm;
