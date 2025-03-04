/**
 * @jest-environment jsdom
 */
import React from 'react';

import {act, fireEvent, render, waitFor} from '@testing-library/react';

import Modal from '../Modal';

jest.useFakeTimers();

describe('Modal', () => {
  test('renders a div with class "modal"', () => {
    render(<Modal is_open />);

    expect(document.body.querySelector('div.modal')).not.toBe(null);
  });

  test('toggle visibility with "is_open"', async () => {
    const {rerender} = render(<Modal />);

    expect(document.body.querySelector('.modal')).toBe(null);

    await act(async () => rerender(<Modal is_open />));
    await waitFor(async () =>
      expect(document.body.querySelector('.modal')).not.toBe(null)
    );

    await act(async () => rerender(<Modal />));
    await waitFor(async () =>
      expect(document.body.querySelector('.modal')).toBe(null)
    );
  });

  test('renders its content', () => {
    render(<Modal is_open>Some modal content</Modal>);
    expect(document.body.querySelector('.modal')).toHaveTextContent(
      'Some modal content'
    );
  });

  test('applies additional CSS classes with props', () => {
    // scrollable content
    const {rerender} = render(<Modal is_open scrollable />);
    expect(document.body.querySelector('.modal-dialog')).toHaveClass(
      'modal-dialog-scrollable'
    );

    // centered modal
    rerender(<Modal is_open centered />);
    expect(document.body.querySelector('.modal-dialog')).toHaveClass(
      'modal-dialog-centered'
    );

    // modal size
    rerender(<Modal is_open size="sm" />);
    expect(document.body.querySelector('.modal-dialog')).toHaveClass(
      'modal-sm'
    );

    rerender(<Modal is_open size="lg" />);
    expect(document.body.querySelector('.modal-dialog')).toHaveClass(
      'modal-lg'
    );

    rerender(<Modal is_open size="xl" />);
    expect(document.body.querySelector('.modal-dialog')).toHaveClass(
      'modal-xl'
    );

    // Content class name
    rerender(<Modal is_open content_class_name="custom-modal-content" />);
    expect(document.body.querySelector('.modal-content')).toHaveClass(
      'custom-modal-content'
    );

    // Content style
    rerender(<Modal is_open content_style={{backgroundColor: 'red'}} />);
    expect(document.body.querySelector('.modal-content')).toHaveStyle({
      backgroundColor: 'red'
    });

    // Backdrop class name
    rerender(<Modal is_open backdrop_class_name="custom-modal-backdrop" />);
    expect(document.body.querySelector('.modal-backdrop')).toHaveClass(
      'custom-modal-backdrop'
    );

    // Backdrop style
    rerender(<Modal is_open backdrop_style={{color: 'red'}} />);
    expect(document.body.querySelector('.modal-backdrop')).toHaveStyle({
      color: 'red'
    });

    // Dialog class name
    rerender(<Modal is_open dialog_class_name="custom-modal-dialog" />);
    expect(document.body.querySelector('.modal-dialog')).toHaveClass(
      'custom-modal-dialog'
    );

    // Dialog style
    rerender(
      <Modal
        is_open
        dialog_style={{position: 'absolute', top: '10px', left: '10px'}}
      />
    );
    expect(document.body.querySelector('.modal-dialog')).toHaveStyle({
      position: 'absolute',
      top: '10px',
      left: '10px'
    });

    // Modal class name
    rerender(<Modal is_open class_name="custom-modal-class" />);
    expect(document.body.querySelector('.modal')).toHaveClass(
      'custom-modal-class'
    );

    // Modal style
    rerender(<Modal is_open style={{color: 'red'}} />);
    expect(document.body.querySelector('.modal')).toHaveStyle({color: 'red'});
  });

  test('sets z-index with zindex and zIndex', () => {
    // scrollable content
    const {rerender} = render(<Modal is_open zindex={1234} />);

    expect(document.body.querySelector('.modal')).toHaveStyle({zIndex: 1234});
    expect(document.body.querySelector('.modal-backdrop')).toHaveStyle({
      zIndex: 1234
    });

    rerender(<Modal is_open zIndex={1111} />);
    expect(document.body.querySelector('.modal')).toHaveStyle({zIndex: 1111});
    expect(document.body.querySelector('.modal-backdrop')).toHaveStyle({
      zIndex: 1111
    });

    rerender(<Modal is_open zIndex={1221} zindex={1331} />);
    expect(document.body.querySelector('.modal')).toHaveStyle({zIndex: 1331});
    expect(document.body.querySelector('.modal-backdrop')).toHaveStyle({
      zIndex: 1331
    });
  });

  describe('backdrop', () => {
    test('when backdrop is True, clicking will dismiss modal', async () => {
      const mockSetProps = jest.fn();
      const {rerender} = render(<Modal is_open setProps={mockSetProps} />);

      const backdrop = document.querySelector('.modal-backdrop');
      expect(backdrop).not.toBe(null);

      fireEvent.click(backdrop);

      await act(async () =>
        rerender(<Modal {...mockSetProps.mock.calls[0][0]} />)
      );
      await waitFor(async () =>
        expect(document.body.querySelector('.modal')).toBe(null)
      );
    });

    test('when backdrop is False, nothing is rendered', () => {
      render(<Modal is_open backdrop={false} />);

      expect(document.body.querySelector('.modal-backdrop')).toBe(null);
    });

    test('when backdrop is "static", a backdrop is rendered, but does not dismiss the modal on click', () => {
      const mockSetProps = jest.fn();
      render(<Modal is_open backdrop="static" setProps={mockSetProps} />);

      const backdrop = document.body.querySelector('.modal-backdrop');
      expect(backdrop).not.toBe(null);

      fireEvent.click(document.body.querySelector('.modal'));

      expect(mockSetProps.mock.calls).toHaveLength(0);
      expect(document.body.querySelector('.modal')).not.toBe(null);
    });
  });
});
