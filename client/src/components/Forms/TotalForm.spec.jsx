import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import 'mutationobserver-shim';
global.MutationObserver = window.MutationObserver;

import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TotalForm from './TotalForm';
import CurrenciesContext from '@/lib/CurrenciesContext';

describe('components/parts render', () => {
  const currencies =
    { 
      input: 
        { 
          currency_name: 'NZD', 
          rate: 1.53 
        },
      result: 
        { 
          currency_name: 'NZD', 
          rate: 1.53 
        }
    };

  test('fields', () => {
    render (
      <CurrenciesContext.Provider value={currencies}>
        <TotalForm />
      </CurrenciesContext.Provider>
    );

    expect(screen.getByLabelText('Principal')).toBeInTheDocument();
    expect(screen.getByLabelText('Monthly')).toBeInTheDocument();
    expect(screen.getByLabelText('Years')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest (%)')).toBeInTheDocument();
    expect(screen.queryByLabelText('Goal (Total)')).not.toBeInTheDocument();
  });

  test('button', () => {
    render (
      <CurrenciesContext.Provider value={currencies}>
        <TotalForm />
      </CurrenciesContext.Provider>
    );

    expect(screen.getByRole('button', { name: 'Tabulate!' })).toBeInTheDocument();
  });

  test('result text', () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <TotalForm />
        </CurrenciesContext.Provider>
      );

    expect(component.container).toHaveTextContent('NZ$0.00 in total, or NZ$0.00 per month at a 4% withdrawal rate');
  });

  test('result text, changed currency', () => {
    currencies.result.currency_name = 'USD';

    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <TotalForm />
        </CurrenciesContext.Provider>
      );

    expect(component.container).toHaveTextContent('$0.00 in total, or $0.00 per month at a 4% withdrawal rate');
  });
});

describe('testing input', () => {
  const currencies =
    { 
      input: 
        { 
          currency_name: 'USD', 
          rate: 1
        },
      result: 
        { 
          currency_name: 'USD', 
          rate: 1
        }
    };

  test('result text changes after input', async () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <TotalForm />
        </CurrenciesContext.Provider>
      );

    const principalField = screen.getByLabelText('Principal');
    const monthlyField = screen.getByLabelText('Monthly');
    const yearField = screen.getByLabelText('Years');
    const rateField = screen.getByLabelText('Interest (%)');

    expect(component.container).toHaveTextContent('$0.00 in total, or $0.00 per month at a 4% withdrawal rate');

    await act(async () => {
      await userEvent.type(principalField, '12000');
      await userEvent.type(monthlyField, '1000');
      await userEvent.type(yearField, '1');
      await userEvent.type(rateField, '5');
    });

    expect(principalField.value).toEqual('12000');
    expect(monthlyField.value).toEqual('1000');
    expect(yearField.value).toEqual('1');
    expect(rateField.value).toEqual('5');

    expect(component.container).toHaveTextContent('$24,600.00 in total, or $82.00 per month at a 4% withdrawal rate');
  });
});

describe('form submit function', () => {
  const currencies =
    { 
      input: 
        { 
          currency_name: 'USD', 
          rate: 1
        },
      result: 
        { 
          currency_name: 'USD', 
          rate: 1
        }
    };

  const placeholderFn = jest.fn();

  afterEach(() => {
    placeholderFn.mockReset();
  });

  test('submitting with incomplete fields', async () => {
    render (
      <CurrenciesContext.Provider value={currencies}>
        <TotalForm formSubmitFunction={placeholderFn} />
      </CurrenciesContext.Provider>
    );

    expect(placeholderFn).toHaveBeenCalledTimes(0);

    await act(async () => {
      await userEvent.type(screen.getByLabelText('Principal'), '12000');
      await userEvent.type(screen.getByLabelText('Monthly'), '1000');
      await userEvent.type(screen.getByLabelText('Interest (%)'), '5');
      fireEvent.click(screen.getByRole('button', { name: 'Tabulate!' }));
    });

    expect(placeholderFn).toHaveBeenCalledTimes(0);
  });

  test('submitting with invalid fields', async () => {
    render (
      <CurrenciesContext.Provider value={currencies}>
        <TotalForm formSubmitFunction={placeholderFn} />
      </CurrenciesContext.Provider>
    );

    expect(placeholderFn).toHaveBeenCalledTimes(0);

    await act(async () => {
      await userEvent.type(screen.getByLabelText('Principal'), '12000');
      await userEvent.type(screen.getByLabelText('Monthly'), '1000');
      await userEvent.type(screen.getByLabelText('Years'), 'a');
      // await userEvent.type(screen.getByLabelText('Years'), '41'); // max 40
      /* I previously thought that you can only test the form's validation
       * upon the form's submission but it looks like it still doesn't work.
       * I guess Jest can't simulate this specific behavior of the browser,
       */
      await userEvent.type(screen.getByLabelText('Interest (%)'), '5');
      fireEvent.click(screen.getByRole('button', { name: 'Tabulate!' }));
    });

    expect(placeholderFn).toHaveBeenCalledTimes(0);
  });

  test('testing normal behavior', async () => {
    render (
      <CurrenciesContext.Provider value={currencies}>
        <TotalForm formSubmitFunction={placeholderFn} />
      </CurrenciesContext.Provider>
    );

    expect(placeholderFn).toHaveBeenCalledTimes(0);

    await act(async () => {
      await userEvent.type(screen.getByLabelText('Principal'), '12000');
      await userEvent.type(screen.getByLabelText('Monthly'), '1000');
      await userEvent.type(screen.getByLabelText('Years'), '1');
      await userEvent.type(screen.getByLabelText('Interest (%)'), '5');
      fireEvent.click(screen.getByRole('button', { name: 'Tabulate!' }));
    });

    expect(placeholderFn).toHaveBeenCalledTimes(1);

    expect(placeholderFn).toHaveBeenCalledWith({
      principal: '12000',
      monthly: '1000',
      years: '1',
      rate: '5'
    }, expect.anything());
  });
});
