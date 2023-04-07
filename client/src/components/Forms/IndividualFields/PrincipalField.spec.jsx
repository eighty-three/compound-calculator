import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PrincipalField from './PrincipalField';

describe('testing label', () => {
  test('label exists', () => {
    render(<PrincipalField register={jest.fn()} handleChange={jest.fn()} />);

    expect(screen.getByLabelText('Principal')).toBeInTheDocument();
  });
});

describe('testing input', () => {
  test('typing numbers', () => {
    render(<PrincipalField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Principal');

    userEvent.type(field, '5');
    expect(field.value).toEqual('5');
  });

  test('typing text', () => {
    render(<PrincipalField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Principal');

    userEvent.type(field, 'a b c');
    expect(field.value).toEqual('');

    userEvent.type(field, '1');
    expect(field.value).toEqual('1');
  });

  test('typing decimals', () => {
    render(<PrincipalField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Principal');

    userEvent.type(field, '.5'); 
    expect(field.value).toEqual('.5');
    // https://spectrum.chat/testing-library/general/testing-form-validation-that-relies-on-html-validation~f3bcf318-bd01-4be3-8ffa-2cb7b207abde

    userEvent.type(field, '1');
    expect(field.value).toEqual('.51');
  });

  test('typing negative numbers', () => {
    render(<PrincipalField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByLabelText('Principal');

    userEvent.type(field, '-1'); 
    expect(field.value).toEqual('-1');

    userEvent.type(field, '1');
    expect(field.value).toEqual('-11');
  });
});
