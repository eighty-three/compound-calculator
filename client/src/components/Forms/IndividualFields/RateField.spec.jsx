import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RateField from './RateField';

describe('testing label', () => {
  test('label exists', () => {
    render(<RateField register={jest.fn()} handleChange={jest.fn()} />);

    expect(screen.getByLabelText('Interest (%)')).toBeInTheDocument();
  });
});

describe('testing input', () => {
  test('typing numbers', () => {
    render(<RateField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Interest (%)');

    userEvent.type(field, '5');
    expect(field.value).toEqual('5');
  });

  test('typing text', () => {
    render(<RateField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Interest (%)');

    userEvent.type(field, 'a b c');
    expect(field.value).toEqual('');

    userEvent.type(field, '1');
    expect(field.value).toEqual('1');
  });

  test('typing decimals', () => {
    render(<RateField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Interest (%)');

    userEvent.type(field, '.5'); 
    expect(field.value).toEqual('.5');

    userEvent.type(field, '1');
    expect(field.value).toEqual('.51');
  });

  test('typing negative numbers', () => {
    render(<RateField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Interest (%)');

    userEvent.type(field, '-1'); 
    expect(field.value).toEqual('-1');
    // https://spectrum.chat/testing-library/general/testing-form-validation-that-relies-on-html-validation~f3bcf318-bd01-4be3-8ffa-2cb7b207abde

    userEvent.type(field, '1');
    expect(field.value).toEqual('-11');
  });

  test('typing numbers past max', () => {
    render(<RateField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Interest (%)');

    userEvent.type(field, '101'); 
    expect(field.value).toEqual('101');
  });
});
