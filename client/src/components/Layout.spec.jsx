import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';
import { render } from '@testing-library/react';

import Layout, { siteTitle } from './Layout';

describe('Navbar exists', () => {
  test('correct text', () => {
    const component = render(<Layout />);

    expect(component.container).toHaveTextContent(siteTitle);
  });
});

describe('children props work', () => {
  const ChildOne = () => {
    return (
      <p>Example Child Component</p>
    );
  };

  const ChildTwo = () => {
    return (
      <p>Example ChildTwo Component</p>
    );
  };

  test('one child', () => {
    const component = render(
      <Layout>
        <ChildOne />
      </Layout>
    );

    expect(component.container).toHaveTextContent(
      'Example Child Component'
    );
  });

  test('two children', () => {
    const component = render(
      <Layout>
        <ChildOne />
        <ChildTwo />
      </Layout>
    );

    expect(component.container).toHaveTextContent(
      'Example Child Component'
    );

    expect(component.container).toHaveTextContent(
      'Example ChildTwo Component'
    );
  });
});
