/**
 * @jest-environment jsdom
 */
import React from 'react';

import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Carousel from '../Carousel';

const slides = [
  {key: '1', src: '', alt: 'a', caption: 'caption 1'},
  {key: '2', src: '', alt: 'b', caption: 'caption 2'},
  {key: '3', src: '', alt: 'c', caption: 'caption 3'}
];

describe('Carousel', () => {
  test('renders a carousel with classes "slide , inner, item, caption"', () => {
    const carousel = render(<Carousel items={slides} />);

    expect(carousel.container.querySelector('div.carousel.slide')).not.toBe(
      null
    );
    expect(carousel.container.querySelector('div.carousel-inner')).not.toBe(
      null
    );
    expect(carousel.container.querySelector('div.carousel-item')).not.toBe(
      null
    );
    expect(carousel.container.querySelector('div.carousel-caption')).not.toBe(
      null
    );
  });

  test('renders its content', () => {
    const carousel = render(<Carousel items={slides} />);

    expect(carousel.queryByText('caption 2')).not.toBe(null);
    expect(carousel.queryByText('caption INFINITY')).toBe(null);
  });

  test('active slide', () => {
    const carousel = render(<Carousel items={slides} />);
    const items = carousel.container.querySelector('div.carousel-inner');

    expect(items.children[0]).toHaveClass('active');
    expect(items.children[1]).not.toHaveClass('active');
  });

  test('tracks most recently clicked slide with "active_index" prop', async () => {
    const user = userEvent.setup();
    const mockSetProps = jest.fn();
    const {container} = render(
      <Carousel items={slides} setProps={mockSetProps} active_index={0} />
    );

    const items = container.querySelector('div.carousel-inner');

    expect(items.children[0]).toHaveClass('active');
    expect(items.children[1]).not.toHaveClass('active');

    const nextButton = container.querySelector('a.carousel-control-next');

    await user.click(nextButton);
    expect(mockSetProps.mock.calls).toHaveLength(1);
    expect(mockSetProps.mock.calls[0][0].active_index).toBe(1);
  });

  test('carousel item accepts href', () => {
    const linkedSlides = [
      {key: '0', src: '', alt: 'z', href: '/test'},
      ...slides
    ];

    const carousel = render(<Carousel items={linkedSlides} />);
    const {firstChild: carouselItem} =
      carousel.container.querySelector('.carousel-inner');
    expect(carouselItem).toHaveAttribute('href', '/test');
    expect(carouselItem.tagName.toLowerCase()).toEqual('a');
  });

  test('carousel item external target', () => {
    const linkedSlides = [
      {
        key: '0',
        src: '',
        alt: 'this is the blank one',
        href: 'http://www.example.com',
        target: '_blank'
      },
      {
        key: '1',
        src: '',
        alt: 'z',
        href: '/test',
        target: '_self',
        external_link: true
      },
      {
        key: '2',
        src: '',
        alt: 'z',
        href: 'http://www.example.com'
      }
    ];

    const carousel = render(<Carousel items={linkedSlides} />);
    const carouselItems = carousel.container.querySelectorAll('.carousel-item');
    const blankTargetItem = carouselItems[0];

    expect(blankTargetItem).toHaveAttribute('target', '_blank');
    expect(blankTargetItem.tagName.toLowerCase()).toEqual('a');

    const selfTargetItem = carouselItems[1];
    expect(selfTargetItem).toHaveAttribute('target', '_self');
    expect(selfTargetItem.tagName.toLowerCase()).toEqual('a');

    const defaultTargetItem = carouselItems[2];
    expect(defaultTargetItem).toHaveAttribute('target', '_self');
    expect(defaultTargetItem.tagName.toLowerCase()).toEqual('a');
  });
});
