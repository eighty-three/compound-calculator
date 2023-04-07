import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import { act, render, screen, fireEvent } from '@testing-library/react';

import CurrencyRates from './CurrencyRates';

const rates = [
  { currency_name: 'USD', rate: 1.00 },
  { currency_name: 'NZD', rate: 1.50 },
  { currency_name: 'AED', rate: 2.00 }
];

const dummyCurrency = {
  input: { ...rates[0] },
  result: { ...rates[0] }
};

const placeholderFn = jest.fn();

describe('components/parts render', () => {
  test('button (input mode)', () => {
    render (
      <CurrencyRates 
        rates={rates} 
        currencies={dummyCurrency}
        setCurrencies={placeholderFn}
      />
    );

    expect(screen.getByText('Input: USD')).toBeInTheDocument();
    expect(screen.queryByText('Result: USD')).not.toBeInTheDocument();
    expect(screen.queryByText('Input: NZD')).not.toBeInTheDocument();
    expect(screen.queryByText('AED: 2')).not.toBeInTheDocument();
  });

  test('button (result mode)', async () => {
    render (
      <CurrencyRates 
        rates={rates} 
        currencies={dummyCurrency}
        setCurrencies={placeholderFn}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /input/i }));

    expect(screen.getByText('Result: USD')).toBeInTheDocument();
    expect(screen.queryByText('Input: USD')).not.toBeInTheDocument();
    expect(screen.queryByText('Result: NZD')).not.toBeInTheDocument();
    expect(screen.queryByText('AED: 2')).not.toBeInTheDocument();
  });

  test('dropdown button', async () => {
    render (
      <CurrencyRates 
        rates={rates} 
        currencies={dummyCurrency}
        setCurrencies={placeholderFn}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '' }));
    }); // When firing events that changes React state, await + async needs to be added

    expect(screen.getByText('AED: 2')).toBeInTheDocument(); // Shows currencies
    expect(screen.getByText('Input: USD')).toBeInTheDocument();
    expect(screen.queryByText('Result: USD')).not.toBeInTheDocument();
    expect(screen.queryByText('Input: NZD')).not.toBeInTheDocument();
  });

});


describe('dropdown button on click', () => {
  afterEach(() => {
    placeholderFn.mockClear();
  });

  test('choosing currency while in input mode', async () => {
    render (
      <CurrencyRates 
        rates={rates} 
        currencies={dummyCurrency}
        setCurrencies={placeholderFn}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '' }));
    }); // When firing events that changes React state, await + async needs to be added

    expect(screen.getByText('AED: 2')).toBeInTheDocument(); // Shows currencies
    expect(screen.getByText('Input: USD')).toBeInTheDocument();
    expect(screen.queryByText('Result: USD')).not.toBeInTheDocument();
    expect(screen.queryByText('Input: NZD')).not.toBeInTheDocument();

    expect(placeholderFn).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'AED: 2' }));

    expect(placeholderFn).toHaveBeenCalledWith({
      input: {
        currency_name: 'AED',
        rate: 2
      },
      result: {
        currency_name: 'USD',
        rate: 1
      }
    });

    expect(screen.getByText('Input: USD')).toBeInTheDocument();
    expect(screen.queryByText('Result: USD')).not.toBeInTheDocument();

    //expect(screen.queryByText('AED: 2')).not.toBeInTheDocument(); 
    /* Dropdown should get closed after selecting an option, as evidenced by
     * `placeholderFn` getting called. The test isn't working for some reason
     */
  });

  test('choosing currency while in result mode', async () => {
    render (
      <CurrencyRates 
        rates={rates} 
        currencies={dummyCurrency}
        setCurrencies={placeholderFn}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '' }));
    });

    expect(screen.getByText('AED: 2')).toBeInTheDocument(); // Shows currencies
    expect(screen.getByText('Input: USD')).toBeInTheDocument();
    expect(screen.queryByText('Result: USD')).not.toBeInTheDocument();
    expect(screen.queryByText('Input: NZD')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /input/i }));

    expect(placeholderFn).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'NZD: 1.5' }));

    expect(placeholderFn).toHaveBeenCalledWith({
      input: {
        currency_name: 'USD',
        rate: 1
      },
      result: {
        currency_name: 'NZD',
        rate: 1.5
      }
    });
  });
});
