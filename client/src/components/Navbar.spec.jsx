import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';
import { render } from '@testing-library/react';

import Navbar from './Navbar';

describe('navbar', () => {
  test('correct text, renders', () => {
    const component = render(<Navbar />);

    expect(component.container).toHaveTextContent(
      'Compound Calculator'
    );
  });
});
