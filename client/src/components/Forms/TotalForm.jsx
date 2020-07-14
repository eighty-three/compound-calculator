import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';

import CurrenciesContext from '@/lib/CurrenciesContext';
import { findTotal, getSWR, twoDecimals } from '@/lib/calculate';
import { PrincipalField, MonthlyField, YearField, RateField } from '@/components/Forms/IndividualFields';

const TotalForm = () => {
  const { register } = useForm({ mode: 'onBlur'});
  const [ formInputs, setFormInputs ] = useState({});
  const currencies = useContext(CurrenciesContext);

  const result = findTotal(formInputs);
  const convertedResult = new Intl.NumberFormat('en-US', 
    { style: 'currency', currency: currencies.result.currency_name })
    .format(twoDecimals(result / currencies.input.rate * currencies.result.rate));
  const SWR = new Intl.NumberFormat('en-US', 
    { style: 'currency', currency: currencies.result.currency_name })
    .format(twoDecimals(getSWR(result / currencies.input.rate * currencies.result.rate)));

  const handleChange = ({ target }) => setFormInputs({ 
    ...formInputs, 
    [target.name]: target.value 
  });

  const fieldProps = { handleChange, register };

  return (
    <Form className="mx-auto">
      <PrincipalField {...fieldProps}/>
      <MonthlyField {...fieldProps}/>
      <YearField {...fieldProps}/>
      <RateField {...fieldProps}/>
      <hr />

      <p>
        <strong>{convertedResult}</strong> 
        {' '}in total, or{' '}
        <strong>{SWR} per month</strong>
        {' '}at a 4% withdrawal rate
      </p>
    </Form>
  );
};

export default TotalForm;
