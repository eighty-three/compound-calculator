import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GoalField from './GoalField';

describe('testing label', () => {
  test('clicking changes label text', () => {
    render(<GoalField register={jest.fn()} handleChange={jest.fn()} />);
    const label = screen.getByText('Goal (Total)');

    expect(screen.getByText('Goal (Total)')).toBeInTheDocument();
    expect(screen.queryByText('Goal (4% WR)')).not.toBeInTheDocument();

    fireEvent.click(label);

    expect(screen.getByText('Goal (4% WR)')).toBeInTheDocument();
    expect(screen.queryByText('Goal (Total)')).not.toBeInTheDocument();
  });

  test('clicking changes placeholder text', () => {
    render(<GoalField register={jest.fn()} handleChange={jest.fn()} />);
    const label = screen.getByText('Goal (Total)');

    expect(screen.queryByPlaceholderText('total * .04 / 12')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('')).toBeInTheDocument();

    fireEvent.click(label);

    expect(screen.getByPlaceholderText('total * .04 / 12')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('')).not.toBeInTheDocument();
  });
});

describe('testing input', () => {
  test('typing numbers', () => {
    render(<GoalField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByPlaceholderText('');

    userEvent.type(field, '5');
    expect(field.value).toEqual('5');
  });

  test('typing text', () => {
    render(<GoalField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByPlaceholderText('');

    userEvent.type(field, 'a b c');
    expect(field.value).toEqual('');

    userEvent.type(field, '1');
    expect(field.value).toEqual('1');
  });

  test('typing decimals', () => {
    render(<GoalField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByPlaceholderText('');

    userEvent.type(field, '.5'); 
    expect(field.value).toEqual('.5');
    // https://spectrum.chat/testing-library/general/testing-form-validation-that-relies-on-html-validation~f3bcf318-bd01-4be3-8ffa-2cb7b207abde

    userEvent.type(field, '1');
    expect(field.value).toEqual('.51');
  });

  test('typing negative numbers', () => {
    render(<GoalField register={jest.fn()} handleChange={jest.fn()} />);
    const field = screen.getByPlaceholderText('');

    userEvent.type(field, '-1'); 
    expect(field.value).toEqual('-1');

    userEvent.type(field, '1');
    expect(field.value).toEqual('-11');
  });
});
