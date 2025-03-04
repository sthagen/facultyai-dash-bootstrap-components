/**
 * @jest-environment jsdom
 */
import React from 'react';

import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DropdownMenu from '../DropdownMenu';
import DropdownMenuItem from '../DropdownMenuItem';

describe('DropdownMenuItem', () => {
  test('renders a button with class "dropdown-menu-item"', () => {
    const dropdownMenuItem = render(<DropdownMenuItem />);

    expect(
      dropdownMenuItem.container.querySelector('button.dropdown-item')
    ).not.toBe(null);
  });

  test('relative links are internal by default', async () => {
    const user = userEvent.setup();
    const dropdownMenuItem = render(
      <DropdownMenuItem href="/relative">Clickable</DropdownMenuItem>
    );

    const mockEventListener = jest.fn();
    window.addEventListener('_dashprivate_pushstate', mockEventListener);
    window.scrollTo = jest.fn();

    expect(mockEventListener.mock.calls).toHaveLength(0);

    await user.click(dropdownMenuItem.getByText('Clickable'));
    expect(mockEventListener.mock.calls).toHaveLength(1);
  });

  test('relative links are external with external_link=true', async () => {
    const user = userEvent.setup();
    const dropdownMenuItem = render(
      <DropdownMenuItem href="/relative" external_link>
        Clickable
      </DropdownMenuItem>
    );

    const mockEventListener = jest.fn();
    window.addEventListener('_dashprivate_pushstate', mockEventListener);
    window.scrollTo = jest.fn();

    expect(mockEventListener.mock.calls).toHaveLength(0);
    await user.click(dropdownMenuItem.getByText('Clickable'));
    expect(mockEventListener.mock.calls).toHaveLength(0);
  });

  test('renders its content', () => {
    const dropdownMenuItem = render(
      <DropdownMenuItem>Some dropdown item content</DropdownMenuItem>
    );

    expect(dropdownMenuItem.container).toHaveTextContent(
      'Some dropdown item content'
    );
  });

  test('tracks clicks with n_clicks', async () => {
    const user = userEvent.setup();
    const mockSetProps = jest.fn();
    const dropdownMenuItem = render(
      <DropdownMenu>
        <DropdownMenuItem setProps={mockSetProps}>Clickable</DropdownMenuItem>
      </DropdownMenu>
    );

    expect(mockSetProps.mock.calls).toHaveLength(0);

    await user.click(dropdownMenuItem.getByText('Clickable'));

    expect(mockSetProps.mock.calls).toHaveLength(1);
    expect(mockSetProps.mock.calls[0][0].n_clicks).toBe(1);
  });

  test("doesn't track clicks if disabled", async () => {
    const user = userEvent.setup();
    const mockSetProps = jest.fn();
    const dropdownMenuItem = render(
      <DropdownMenu>
        <DropdownMenuItem setProps={mockSetProps} disabled>
          Clickable
        </DropdownMenuItem>
      </DropdownMenu>
    );

    expect(dropdownMenuItem.getByText('Clickable')).toHaveClass('disabled');
    expect(mockSetProps.mock.calls).toHaveLength(0);

    await user.click(dropdownMenuItem.getByText('Clickable'));

    expect(mockSetProps.mock.calls).toHaveLength(0);
  });

  test('dismisses parent DropdownMenu when clicked', async () => {
    const user = userEvent.setup();
    const dropdownMenu = render(
      <DropdownMenu label="toggle">
        <DropdownMenuItem>Clickable</DropdownMenuItem>
      </DropdownMenu>
    );

    await user.click(dropdownMenu.getByText('toggle'));
    expect(dropdownMenu.container.querySelector('.dropdown-menu')).toHaveClass(
      'show'
    );

    await user.click(dropdownMenu.getByText('Clickable'));
    expect(
      dropdownMenu.container.querySelector('.dropdown-menu')
    ).not.toHaveClass('show');
  });

  test("doesn't dismiss parent DropdownMenu when clicked if toggle=false", async () => {
    const user = userEvent.setup();
    const dropdownMenu = render(
      <DropdownMenu label="toggle">
        <DropdownMenuItem toggle={false}>Clickable</DropdownMenuItem>
      </DropdownMenu>
    );

    await user.click(dropdownMenu.getByText('toggle'));
    expect(dropdownMenu.container.querySelector('.dropdown-menu')).toHaveClass(
      'show'
    );

    await user.click(dropdownMenu.getByText('Clickable'));
    expect(dropdownMenu.container.querySelector('.dropdown-menu')).toHaveClass(
      'show'
    );
  });
});
