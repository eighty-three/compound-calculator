import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import CurrenciesContext from '@/lib/CurrenciesContext';
import { findTotal, getSWR, twoDecimals } from '@/lib/calculate';
import { PrincipalField, MonthlyField, YearField, RateField } from '@/components/Forms/IndividualFields';

const propTypes = {
  formSubmitFunction: PropTypes.func
};

const TotalForm = ({ formSubmitFunction }) => {
  const { register, handleSubmit } = useForm({ mode: 'onBlur'});
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
    <>
      <Form className="mx-auto" onSubmit={handleSubmit(formSubmitFunction)}>
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
        <hr />

        <Button variant="dark" type="submit" block>
          Tabulate!
        </Button>
      </Form>
    </>
  );
};

TotalForm.propTypes = propTypes;

export default TotalForm;
