import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import 'mutationobserver-shim';
global.MutationObserver = window.MutationObserver;

import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import YearsForm from './YearsForm';
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
        <YearsForm />
      </CurrenciesContext.Provider>
    );

    expect(screen.getByLabelText('Goal (Total)')).toBeInTheDocument();
    expect(screen.getByLabelText('Monthly')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest (%)')).toBeInTheDocument();
    expect(screen.queryByLabelText('Principal')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Years')).not.toBeInTheDocument();
  });

  test('result text', () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <YearsForm />
        </CurrenciesContext.Provider>
      );

    expect(component.container).toHaveTextContent('You need 0 years to reach your goal');
  });

  test('result text, changed currency', () => {
    currencies.input.currency_name = 'USD';

    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <YearsForm />
        </CurrenciesContext.Provider>
      );

    expect(component.container).toHaveTextContent('You need 0 years to reach your goal');
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
          <YearsForm />
        </CurrenciesContext.Provider>
      );

    const goalField = screen.getByLabelText('Goal (Total)');
    const monthlyField = screen.getByLabelText('Monthly');
    const rateField = screen.getByLabelText('Interest (%)');

    expect(component.container).toHaveTextContent('You need 0 years to reach your goal');

    await act(async () => {
      await userEvent.type(goalField, '24000');
      await userEvent.type(monthlyField, '1000');
      await userEvent.type(rateField, '5');
    });

    expect(goalField.value).toEqual('24000');
    expect(monthlyField.value).toEqual('1000');
    expect(rateField.value).toEqual('5');

    expect(component.container).toHaveTextContent('You need 1.95 years to reach your goal');
  });

  test('result text changes after input, goal (4% WR)', async () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <YearsForm />
        </CurrenciesContext.Provider>
      );

    fireEvent.click(screen.getByText('Goal (Total)'));

    const goalField = screen.getByLabelText('Goal (4% WR)');
    const monthlyField = screen.getByLabelText('Monthly');
    const rateField = screen.getByLabelText('Interest (%)');

    expect(component.container).toHaveTextContent('You need 0 years to reach your goal');

    await act(async () => {
      await userEvent.type(goalField, '24000');
      await userEvent.type(monthlyField, '1000');
      await userEvent.type(rateField, '5');
    });

    expect(goalField.value).toEqual('24000');
    expect(monthlyField.value).toEqual('1000');
    expect(rateField.value).toEqual('5');

    expect(component.container).toHaveTextContent('You need 70.38 years to reach your goal');
  });

  test('result text changes after toggling goal modes', async () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <YearsForm />
        </CurrenciesContext.Provider>
      );

    fireEvent.click(screen.getByText('Goal (Total)'));

    const goalField = screen.getByLabelText('Goal (4% WR)');
    const monthlyField = screen.getByLabelText('Monthly');
    const rateField = screen.getByLabelText('Interest (%)');

    expect(component.container).toHaveTextContent('You need 0 years to reach your goal');

    await act(async () => {
      await userEvent.type(goalField, '24000');
      await userEvent.type(monthlyField, '1000');
      await userEvent.type(rateField, '5');
    });

    expect(component.container).toHaveTextContent('You need 70.38 years to reach your goal');

    fireEvent.click(screen.getByText('Goal (4% WR)'));

    expect(component.container).toHaveTextContent('You need 1.95 years to reach your goal');
  });

  test('flavor', async () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <YearsForm />
        </CurrenciesContext.Provider>
      );

    const goalField = screen.getByLabelText('Goal (Total)');
    const monthlyField = screen.getByLabelText('Monthly');
    const rateField = screen.getByLabelText('Interest (%)');

    expect(component.container).toHaveTextContent('You need 0 years to reach your goal');

    await act(async () => {
      await userEvent.type(goalField, '12000');
      await userEvent.type(monthlyField, '1000');
      await userEvent.type(rateField, '5');
    });

    expect(goalField.value).toEqual('12000');
    expect(monthlyField.value).toEqual('1000');
    expect(rateField.value).toEqual('5');

    expect(component.container).toHaveTextContent('You could\'ve figured that out yourself');
  });
});
