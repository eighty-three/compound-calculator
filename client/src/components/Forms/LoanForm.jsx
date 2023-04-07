import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';

import CurrenciesContext from '@/lib/CurrenciesContext';
import { findAmortization, twoDecimals } from '@/lib/calculate';
import { PrincipalField, YearField, RateField } from '@/components/Forms/IndividualFields';

const MonthlyForm = () => {
  const { register } = useForm({ mode: 'onBlur'});
  const [ formInputs, setFormInputs ] = useState({});
  const currencies = useContext(CurrenciesContext);

  const { monthly: result, interest } = findAmortization(formInputs);
  const convertedResult = new Intl.NumberFormat('en-US', 
    { style: 'currency', currency: currencies.input.currency_name })
    .format(twoDecimals(result * currencies.input.rate / currencies.result.rate));

  const convertedInterest = new Intl.NumberFormat('en-US', 
    { style: 'currency', currency: currencies.input.currency_name })
    .format(twoDecimals(interest * currencies.input.rate / currencies.result.rate));
  
  const handleChange = ({ target }) => setFormInputs({ 
    ...formInputs, 
    [target.name]: target.value 
  });

  const fieldProps = { handleChange, register };

  return (
    <Form className="mx-auto">
      <PrincipalField label={'Loan Amount'} {...fieldProps}/>
      <YearField {...fieldProps}/>
      <RateField {...fieldProps}/>
      <hr />

      <p>
        You need to pay <strong>{convertedResult}</strong>{' '}
        every month, for a total of <strong>{convertedInterest}</strong> interest paid
      </p>
    </Form>
  );
};

export default MonthlyForm;
