/**
 * @jest-environment jsdom
 */
import React from 'react';

import {act, fireEvent, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Input from '../Input';

describe('Input', () => {
  test('renders an input with class "form-control"', () => {
    const input = render(<Input />);

    expect(input.container.querySelector('input.form-control')).not.toBe(null);
  });

  test('has no value by default', () => {
    const input = render(<Input />);

    expect(input.container.firstChild).not.toHaveValue();
  });

  test('passes value on to the underlying HTML input', () => {
    const {
      container: {firstChild: input},
      rerender
    } = render(<Input value="some-input-value" />);

    expect(input).toHaveValue('some-input-value');

    rerender(<Input value="another-input-value" />);
    expect(input).toHaveValue('another-input-value');
  });

  test('passes HTML attributes on to underlying input', () => {
    const {
      container: {firstChild: input}
    } = render(
      <Input
        autocomplete="username"
        disabled
        inputmode="verbatim"
        list="datalist-id"
        max={10}
        maxlength="20"
        min={1}
        minlength="2"
        name="test-name"
        pattern="test-pattern"
        placeholder="test-placeholder"
        html_size="42"
        readonly
        step={2}
        tabindex="3"
        type="text"
      />
    );

    expect(input).toHaveAttribute('autocomplete', 'username');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('inputmode', 'verbatim');
    expect(input).toHaveAttribute('list', 'datalist-id');
    expect(input).toHaveAttribute('max', '10');
    expect(input).toHaveAttribute('maxlength', '20');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('minlength', '2');
    expect(input).toHaveAttribute('name', 'test-name');
    expect(input).toHaveAttribute('pattern', 'test-pattern');
    expect(input).toHaveAttribute('placeholder', 'test-placeholder');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('size', '42');
    expect(input).toHaveAttribute('step', '2');
    expect(input).toHaveAttribute('tabindex', '3');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('sets validity using "valid" and "invalid" props', () => {
    const validInput = render(<Input valid />);
    const invalidInput = render(<Input invalid />);

    expect(validInput.container.firstChild).toHaveClass('is-valid');
    expect(invalidInput.container.firstChild).toHaveClass('is-invalid');
  });

  describe('setProps', () => {
    let inputElement, mockSetProps;

    beforeEach(() => {
      mockSetProps = jest.fn();
      const {container} = render(<Input setProps={mockSetProps} />);
      inputElement = container.firstChild;
    });

    test('tracks changes with "value" prop', () => {
      fireEvent.change(inputElement, {
        target: {value: 'some-input-value'}
      });
      expect(mockSetProps.mock.calls).toHaveLength(1);
      expect(mockSetProps.mock.calls[0][0]).toEqual({
        value: 'some-input-value'
      });
    });

    test('dispatches update for each typed character', async () => {
      const user = userEvent.setup();
      await user.type(inputElement, 'abc');

      expect(mockSetProps.mock.calls).toHaveLength(3);

      const [call1, call2, call3] = mockSetProps.mock.calls;
      expect(call1).toEqual([{value: 'a'}]);
      expect(call2).toEqual([{value: 'ab'}]);
      expect(call3).toEqual([{value: 'abc'}]);
    });

    test('track number of blurs with "n_blur"', () => {
      fireEvent.blur(inputElement);

      expect(mockSetProps.mock.calls).toHaveLength(1);

      const [[{n_blur}]] = mockSetProps.mock.calls;
      expect(n_blur).toEqual(1);
    });

    test('tracks submit with "n_submit"', () => {
      fireEvent.keyUp(inputElement, {key: 'Enter', code: 13, charCode: 13});

      expect(mockSetProps.mock.calls).toHaveLength(1);

      const [[{n_submit}]] = mockSetProps.mock.calls;
      expect(n_submit).toEqual(1);
    });

    test("don't increment n_submit if key is not Enter", () => {
      fireEvent.keyPress(inputElement, {key: 'a', code: 65, charCode: 65});
      expect(mockSetProps.mock.calls).toHaveLength(0);
    });
  });

  describe('debounce', () => {
    let inputElement, mockSetProps;
    beforeEach(() => {
      mockSetProps = jest.fn();
      const {container} = render(
        <Input setProps={mockSetProps} value="some-input-value" debounce />
      );
      inputElement = container.firstChild;
    });

    test("don't call setProps on change if debounce is true", () => {
      fireEvent.change(inputElement, {
        target: {value: 'some-new-input-value'}
      });
      expect(mockSetProps.mock.calls).toHaveLength(0);
      expect(inputElement).toHaveValue('some-new-input-value');
    });

    test('dispatch value on blur if debounce is true', () => {
      fireEvent.blur(inputElement);

      expect(mockSetProps.mock.calls).toHaveLength(1);

      const [[{n_blur, value}]] = mockSetProps.mock.calls;
      expect(n_blur).toEqual(1);
      expect(value).toEqual('some-input-value');
    });

    test('dispatch value on submit if debounce is true', () => {
      fireEvent.keyUp(inputElement, {key: 'Enter', code: 13, charCode: 13});

      expect(mockSetProps.mock.calls).toHaveLength(1);

      const [[{n_submit, value}]] = mockSetProps.mock.calls;
      expect(n_submit).toEqual(1);
      expect(value).toEqual('some-input-value');
    });
  });

  describe('numeric debounce', () => {
    let inputElement, mockSetProps;

    beforeEach(() => {
      jest.useFakeTimers();
      mockSetProps = jest.fn();
      const {container} = render(
        <Input setProps={mockSetProps} value="" debounce={2000} />
      );
      inputElement = container.firstChild;
    });

    test('call setProps after delay if debounce is number', () => {
      fireEvent.change(inputElement, {
        target: {value: 'some-input-value'}
      });
      expect(mockSetProps.mock.calls).toHaveLength(0);
      expect(inputElement).toHaveValue('some-input-value');
      act(() => jest.advanceTimersByTime(1000));
      expect(mockSetProps.mock.calls).toHaveLength(0);
      act(() => jest.advanceTimersByTime(1000));
      expect(mockSetProps.mock.calls).toHaveLength(1);
    });
  });

  describe('number input', () => {
    let inputElement, mockSetProps;

    beforeEach(() => {
      mockSetProps = jest.fn();
      const {container} = render(
        <Input setProps={mockSetProps} type="number" />
      );
      inputElement = container.firstChild;
    });

    test('tracks changes with "value" prop', () => {
      fireEvent.change(inputElement, {
        target: {value: 12}
      });
      expect(inputElement).toHaveValue(12);

      fireEvent.change(inputElement, {
        target: {value: -42}
      });
      expect(inputElement).toHaveValue(-42);

      fireEvent.change(inputElement, {
        target: {value: 1.01}
      });
      expect(inputElement).toHaveValue(1.01);

      fireEvent.change(inputElement, {
        target: {value: 0}
      });
      expect(inputElement).toHaveValue(0);

      expect(mockSetProps.mock.calls).toHaveLength(4);

      const [call1, call2, call3, call4] = mockSetProps.mock.calls;
      expect(call1).toEqual([{value: 12}]);
      expect(call2).toEqual([{value: -42}]);
      expect(call3).toEqual([{value: 1.01}]);
      expect(call4).toEqual([{value: 0}]);
    });

    test('dispatches update for each typed character', () => {
      fireEvent.input(inputElement, {target: {value: '-'}});
      fireEvent.input(inputElement, {target: {value: '-1'}});
      fireEvent.input(inputElement, {target: {value: '-1e'}});
      fireEvent.input(inputElement, {target: {value: '-1e4'}});

      expect(inputElement).toHaveValue(-10000);
      expect(mockSetProps.mock.calls).toHaveLength(2);

      const [call1, call3] = mockSetProps.mock.calls;
      expect(call1).toEqual([{value: -1}]);
      expect(call3).toEqual([{value: -10000}]);
    });

    test('only accepts numeric input', () => {
      userEvent.type(inputElement, 'asdf?');

      expect(inputElement).not.toHaveValue();
      expect(mockSetProps.mock.calls).toHaveLength(0);
    });

    test('passes value on to the underlying HTML input', () => {
      const {
        container: {firstChild: input},
        rerender
      } = render(<Input type="number" value={10} />);

      expect(input).toHaveValue(10);

      rerender(<Input type="number" value={12} />);
      expect(input).toHaveValue(12);
    });

    test('returns NaN once for invalid number', () => {
      const {
        container: {firstChild: input}
      } = render(
        <Input type="number" min={0} value={0} setProps={mockSetProps} />
      );

      // can't use userEvent.type here because it hangs when trying to enter invalid
      // inputs, instead we simulate typing additional invalid characters with multiple
      // fireEvent.change calls
      fireEvent.change(input, {target: {value: '0-'}});
      fireEvent.change(input, {target: {value: '0-1'}});
      fireEvent.change(input, {target: {value: '0-12'}});

      expect(mockSetProps.mock.calls).toHaveLength(1);
      expect(mockSetProps.mock.calls[0][0]).toEqual({value: NaN});
    });
  });
});
