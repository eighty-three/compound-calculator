import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import 'mutationobserver-shim';
global.MutationObserver = window.MutationObserver;

import { render, screen, fireEvent } from '@testing-library/react';

import ComputeModes from './ComputeModes';
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
  test('chart', () => {
    render (
      <CurrenciesContext.Provider value={currencies}>
        <ComputeModes />
      </CurrenciesContext.Provider>
    );

    expect(screen.queryByRole('columnheader', { name: 'Year' })).not.toBeInTheDocument();
  });

  test('tabs', () => {
    render (
      <CurrenciesContext.Provider value={currencies}>
        <ComputeModes />
      </CurrenciesContext.Provider>
    );

    expect(screen.getByRole('tab', { name: 'Total' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Years' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Monthly' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Principal' })).not.toBeInTheDocument();
  });

  test('mode total', () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <ComputeModes />
        </CurrenciesContext.Provider>
      );

    expect(screen.getByLabelText('Principal')).toBeInTheDocument();
    expect(screen.getByLabelText('Monthly')).toBeInTheDocument();
    expect(screen.getByLabelText('Years')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest (%)')).toBeInTheDocument();
    expect(screen.queryByLabelText('Goal (Total)')).not.toBeInTheDocument();

    expect(component.container).toHaveTextContent('NZ$0.00 in total, or NZ$0.00 per month at a 4% withdrawal rate');
    expect(component.container).not.toHaveTextContent('You need 0 years to reach your goal');
  });

  test('mode years', () => {
    const component =
      render (
        <CurrenciesContext.Provider value={currencies}>
          <ComputeModes />
        </CurrenciesContext.Provider>
      );

    fireEvent.click(screen.getByRole('tab', { name: 'Years' }));

    expect(screen.getByLabelText('Goal (Total)')).toBeInTheDocument();
    expect(screen.getByLabelText('Monthly')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest (%)')).toBeInTheDocument();
    expect(screen.queryByLabelText('Principal')).not.toBeInTheDocument();
    expect(screen.queryByRole('form', { name: 'Years' })).not.toBeInTheDocument();

    expect(component.container).toHaveTextContent('You need 0 years to reach your goal');
    expect(component.container).not.toHaveTextContent('NZ$0.00 in total, or NZ$0.00 per month at a 4% withdrawal rate');
  });

  test('mode monthly', () => {
    const component = 
      render (
        <CurrenciesContext.Provider value={currencies}>
          <ComputeModes />
        </CurrenciesContext.Provider>
      );

    fireEvent.click(screen.getByRole('tab', { name: 'Monthly' }));

    expect(screen.getByLabelText('Goal (Total)')).toBeInTheDocument();
    expect(screen.getByLabelText('Years')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest (%)')).toBeInTheDocument();
    expect(screen.queryByLabelText('Principal')).not.toBeInTheDocument();
    expect(screen.queryByRole('form', { name: 'Monthly' })).not.toBeInTheDocument();

    expect(component.container).toHaveTextContent('You need NZ$0.00 in monthly contributions to reach your goal');
    expect(component.container).not.toHaveTextContent('NZ$0.00 in total, or NZ$0.00 per month at a 4% withdrawal rate');
  });
});
