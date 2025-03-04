/**
 * @jest-environment jsdom
 */
import React from 'react';

import {render} from '@testing-library/react';

import Navbar from '../Navbar';

describe('Navbar', () => {
  test('renders a nav with class "navbar"', () => {
    const {container} = render(<Navbar />);

    expect(container.querySelector('nav.navbar')).not.toBe(null);
  });

  test('renders its content', () => {
    const {
      container: {firstChild: navbar}
    } = render(<Navbar>Some navbar content</Navbar>);
    expect(navbar).toHaveTextContent('Some navbar content');
  });

  test('applies additional CSS classes when props are set', () => {
    // dark navbar
    const {
      container: {firstChild: navbarDark}
    } = render(<Navbar dark />);
    expect(navbarDark).toHaveClass('navbar-dark');

    // sticky navbars
    const {
      container: {firstChild: navbarStickyTop}
    } = render(<Navbar sticky="top" />);

    expect(navbarStickyTop).toHaveClass('sticky-top');

    // fixed navbars
    const {
      container: {firstChild: navbarFixedTop}
    } = render(<Navbar fixed="top" />);
    const {
      container: {firstChild: navbarFixedBottom}
    } = render(<Navbar fixed="bottom" />);

    expect(navbarFixedTop).toHaveClass('fixed-top');
    expect(navbarFixedBottom).toHaveClass('fixed-bottom');

    // navbar expand
    const {
      container: {firstChild: navbarExpandSm}
    } = render(<Navbar expand="sm" />);
    expect(navbarExpandSm).toHaveClass('navbar-expand-sm');
    const {
      container: {firstChild: navbarExpandMd}
    } = render(<Navbar expand="md" />);
    expect(navbarExpandMd).toHaveClass('navbar-expand-md');
    const {
      container: {firstChild: navbarExpandLg}
    } = render(<Navbar expand="lg" />);
    expect(navbarExpandLg).toHaveClass('navbar-expand-lg');
    const {
      container: {firstChild: navbarExpandXl}
    } = render(<Navbar expand="xl" />);
    expect(navbarExpandXl).toHaveClass('navbar-expand-xl');
  });

  test('applies contextual colors with "color" prop', () => {
    const {
      container: {firstChild: navbarPrimary}
    } = render(<Navbar color="primary" />);
    const {
      container: {firstChild: navbarSuccess}
    } = render(<Navbar color="success" />);
    const {
      container: {firstChild: navbarDark}
    } = render(<Navbar color="dark" />);
    const {
      container: {firstChild: navbarCss}
    } = render(<Navbar color="chocolate" />);
    const {
      container: {firstChild: navbarCustom}
    } = render(<Navbar color="#123456" />);

    expect(navbarPrimary).toHaveClass('bg-primary');
    expect(navbarSuccess).toHaveClass('bg-success');
    expect(navbarDark).toHaveClass('bg-dark');
    expect(navbarCss).toHaveStyle({backgroundColor: 'chocolate'});
    expect(navbarCustom).toHaveStyle({backgroundColor: '#123456'});
  });
});
