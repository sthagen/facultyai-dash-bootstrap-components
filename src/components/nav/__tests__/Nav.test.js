/**
 * @jest-environment jsdom
 */
import React from 'react';

import {render} from '@testing-library/react';

import Nav from '../Nav';

describe('Nav', () => {
  test('renders a div with class "nav"', () => {
    const nav = render(<Nav />);

    expect(nav.container.querySelector('div.nav')).not.toBe(null);
  });

  test('renders its content', () => {
    const {container} = render(<Nav>Some nav content</Nav>);

    expect(container).toHaveTextContent('Some nav content');
  });

  test('applies additional CSS classes when props are set', () => {
    // pills
    const {
      container: {firstChild: navPills}
    } = render(<Nav pills />);

    expect(navPills).toHaveClass('nav-pills');

    // vertical navs
    const {
      container: {firstChild: navVertical}
    } = render(<Nav vertical />);
    const {
      container: {firstChild: navVerticalSm}
    } = render(<Nav vertical="sm" />);
    const {
      container: {firstChild: navVerticalMd}
    } = render(<Nav vertical="md" />);
    const {
      container: {firstChild: navVerticalLg}
    } = render(<Nav vertical="lg" />);
    const {
      container: {firstChild: navVerticalXl}
    } = render(<Nav vertical="xl" />);

    expect(navVertical).toHaveClass('flex-column');
    expect(navVerticalSm).toHaveClass('flex-sm-column');
    expect(navVerticalMd).toHaveClass('flex-md-column');
    expect(navVerticalLg).toHaveClass('flex-lg-column');
    expect(navVerticalXl).toHaveClass('flex-xl-column');

    // fill and justified
    const {
      container: {firstChild: navFill}
    } = render(<Nav fill />);
    const {
      container: {firstChild: navJustified}
    } = render(<Nav justified />);

    expect(navFill).toHaveClass('nav-fill');
    expect(navJustified).toHaveClass('nav-justified');

    // horizontal alignment
    const {
      container: {firstChild: navJustifyCenter}
    } = render(<Nav horizontal="center" />);
    expect(navJustifyCenter).toHaveClass('justify-content-center');
    const {
      container: {firstChild: navJustifyAround}
    } = render(<Nav horizontal="around" />);
    expect(navJustifyAround).toHaveClass('justify-content-around');
  });
});
