import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import YearField from './YearField';

describe('testing label', () => {
  test('label exists', () => {
    render(<YearField register={jest.fn()} handleChange={jest.fn()} />);

    expect(screen.getByLabelText('Years')).toBeInTheDocument();
  });
});

describe('testing input', () => {
  test('typing numbers', () => {
    render(<YearField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Years');

    userEvent.type(field, '5');
    expect(field.value).toEqual('5');
  });

  test('typing text', () => {
    render(<YearField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Years');

    userEvent.type(field, 'a b c');
    expect(field.value).toEqual('');

    userEvent.type(field, '1');
    expect(field.value).toEqual('1');
  });

  test('typing decimals', () => {
    render(<YearField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Years');

    userEvent.type(field, '.5'); 
    expect(field.value).toEqual('.5');
    // https://spectrum.chat/testing-library/general/testing-form-validation-that-relies-on-html-validation~f3bcf318-bd01-4be3-8ffa-2cb7b207abde

    userEvent.type(field, '1');
    expect(field.value).toEqual('.51');
  });

  test('typing negative numbers', () => {
    render(<YearField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Years');

    userEvent.type(field, '-1'); 
    expect(field.value).toEqual('-1');

    userEvent.type(field, '1');
    expect(field.value).toEqual('-11');
  });

  test('typing numbers past max', () => {
    render(<YearField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Years');

    userEvent.type(field, '42'); 
    expect(field.value).toEqual('42');
  });
});


