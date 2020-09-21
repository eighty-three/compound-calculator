import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import { render, screen } from '@testing-library/react';

import GrowthTable from './GrowthTable';

describe('renders', () => {
  const USD = {
    input: { currency_name: 'USD', rate: 1 },
    result: { currency_name: 'USD', rate: 1 }
  };

  const AED = {
    input: { currency_name: 'USD', rate: 1 },
    result: { currency_name: 'AED', rate: 2}
  };

  test('progression length = 0', () => {
    const arr = [];
    render(<GrowthTable progression={arr} currencies={USD} />);

    expect(screen.queryByRole('columnheader', { name: 'Year' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Total' })).not.toBeInTheDocument();
  });

  test('progression length = 1', () => {
    const arr = [100];
    render(<GrowthTable progression={arr} currencies={USD} />);

    expect(screen.queryByRole('columnheader', { name: 'Year' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Total' })).not.toBeInTheDocument();
  });

  test('progression length > 1', () => {
    const arr = [100, 200];
    render(<GrowthTable progression={arr} currencies={USD} />);

    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Total' })).toBeInTheDocument();

    expect(screen.getByRole('cell', { name: '$100.00' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$200.00' })).toBeInTheDocument();
  });

  test('progression length > 1 && different currency', () => {
    const arr = [100, 200];
    render(<GrowthTable progression={arr} currencies={AED} />);

    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Total' })).toBeInTheDocument();

    expect(screen.getByRole('cell', { name: 'AED 200.00' })).toBeInTheDocument();
    //expect(screen.getByRole('cell', { name: 'AED 200.00' })).toBeInTheDocument();
    /* It keeps on giving some errors when I manually type 'AED 200.00' 
     * in the name key. I just copypasted the output it keeps on telling me 
     * and ran it through text-compare.com. I guess `Intl.NumberFormat` 
     * uses a special character to separate the currency from the number 
     * instead of just a space.
     */
    expect(screen.getByRole('cell', { name: 'AED 400.00' })).toBeInTheDocument();

    expect(screen.queryByRole('cell', { name: '$100.00' })).not.toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: '$200.00' })).not.toBeInTheDocument();
  });
});
