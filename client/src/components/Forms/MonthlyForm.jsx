import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';

import CurrenciesContext from '@/lib/CurrenciesContext';
import { findMonthly, twoDecimals } from '@/lib/calculate';
import { GoalField, YearField, RateField } from '@/components/Forms/IndividualFields';

const MonthlyForm = () => {
  const { register } = useForm({ mode: 'onBlur'});
  const [ formInputs, setFormInputs ] = useState({});
  const currencies = useContext(CurrenciesContext);

  const result = findMonthly(formInputs);
  const convertedResult = new Intl.NumberFormat('en-US', 
    { style: 'currency', currency: currencies.input.currency_name })
    .format(twoDecimals(result * currencies.input.rate / currencies.result.rate));
  
  const handleChange = ({ target }) => setFormInputs({ 
    ...formInputs, 
    [target.name]: target.value 
  });

  const fieldProps = { handleChange, register };

  return (
    <Form className="mx-auto">
      <GoalField {...fieldProps}/>
      <YearField {...fieldProps}/>
      <RateField {...fieldProps}/>
      <hr />

      <p>
        You need <strong>{convertedResult}</strong>{' '}
        in monthly contributions to reach your goal
      </p>
    </Form>
  );
};

export default MonthlyForm;
