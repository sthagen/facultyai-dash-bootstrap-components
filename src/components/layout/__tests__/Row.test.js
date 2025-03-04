/**
 * @jest-environment jsdom
 */
import React from 'react';

import {render} from '@testing-library/react';

import Row from '../Row';

describe('Row', () => {
  test('renders a div with class "row"', () => {
    const row = render(<Row />);

    expect(row.container.querySelector('div.row')).not.toBe(null);
  });

  test('renders its content', () => {
    const row = render(<Row>Some row content</Row>);

    expect(row.container).toHaveTextContent('Some row content');
  });

  test('applies additional CSS classes when props are set', () => {
    // row align
    const {
      container: {firstChild: rowAlign}
    } = render(<Row align="center" />);

    expect(rowAlign).toHaveClass('align-items-center');

    // row justify
    const {
      container: {firstChild: rowJustify}
    } = render(<Row justify="between" />);

    expect(rowJustify).toHaveClass('justify-content-between');
  });
});
