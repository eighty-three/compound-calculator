import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import 'mutationobserver-shim';
global.MutationObserver = window.MutationObserver;

import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MonthlyForm from './MonthlyForm';
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
        <MonthlyForm />
      </CurrenciesContext.Provider>
    );

    expect(screen.getByLabelText('Goal (Total)')).toBeInTheDocument();
    expect(screen.getByLabelText('Years')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest (%)')).toBeInTheDocument();
    expect(screen.queryByLabelText('Principal')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Monthly')).not.toBeInTheDocument();
  });

  test('result text', () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <MonthlyForm />
        </CurrenciesContext.Provider>
      );

    expect(component.container).toHaveTextContent('You need NZ$0.00 in monthly contributions to reach your goal');
  });

  test('result text, changed currency', () => {
    currencies.input.currency_name = 'USD';

    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <MonthlyForm />
        </CurrenciesContext.Provider>
      );

    expect(component.container).toHaveTextContent('You need $0.00 in monthly contributions to reach your goal');
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

  test('result text changes after input, goal (total)', async () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <MonthlyForm />
        </CurrenciesContext.Provider>
      );

    const goalField = screen.getByLabelText('Goal (Total)');
    const yearField = screen.getByLabelText('Years');
    const rateField = screen.getByLabelText('Interest (%)');

    expect(component.container).toHaveTextContent('You need $0.00 in monthly contributions to reach your goal');

    await act(async () => {
      await userEvent.type(goalField, '12000');
      await userEvent.type(yearField, '1');
      await userEvent.type(rateField, '5');
    });

    expect(goalField.value).toEqual('12000');
    expect(yearField.value).toEqual('1');
    expect(rateField.value).toEqual('5');

    expect(component.container).toHaveTextContent('You need $1,000.00 in monthly contributions to reach your goal');
  });

  test('result text changes after input, goal (4% WR)', async () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <MonthlyForm />
        </CurrenciesContext.Provider>
      );

    fireEvent.click(screen.getByText('Goal (Total)'));

    const goalField = screen.getByLabelText('Goal (4% WR)');
    const yearField = screen.getByLabelText('Years');
    const rateField = screen.getByLabelText('Interest (%)');

    expect(component.container).toHaveTextContent('You need $0.00 in monthly contributions to reach your goal');

    await act(async () => {
      await userEvent.type(goalField, '1000');
      await userEvent.type(yearField, '1');
      await userEvent.type(rateField, '5');
    });

    expect(goalField.value).toEqual('1000');
    expect(yearField.value).toEqual('1');
    expect(rateField.value).toEqual('5');

    expect(component.container).toHaveTextContent('You need $25,000.00 in monthly contributions to reach your goal');
  });

  test('result text changes after toggling goal modes', async () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <MonthlyForm />
        </CurrenciesContext.Provider>
      );

    fireEvent.click(screen.getByText('Goal (Total)'));

    const goalField = screen.getByLabelText('Goal (4% WR)');
    const yearField = screen.getByLabelText('Years');
    const rateField = screen.getByLabelText('Interest (%)');

    expect(component.container).toHaveTextContent('You need $0.00 in monthly contributions to reach your goal');

    await act(async () => {
      await userEvent.type(goalField, '1000');
      await userEvent.type(yearField, '1');
      await userEvent.type(rateField, '5');
    });

    expect(component.container).toHaveTextContent('You need $25,000.00 in monthly contributions to reach your goal');

    fireEvent.click(screen.getByText('Goal (4% WR)'));

    expect(component.container).toHaveTextContent('You need $83.33 in monthly contributions to reach your goal');
  });
});

