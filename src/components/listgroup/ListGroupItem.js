import React from 'react';
import PropTypes from 'prop-types';
import RBListGroupItem from 'react-bootstrap/ListGroupItem';
import Link from '../../private/Link';
import {bootstrapColors} from '../../private/BootstrapColors';
import {getLoadingState} from '../../private/util';

/**
 * Create a single item in a `ListGroup`.
 */
const ListGroupItem = props => {
  let {
    children,
    disabled,
    href,
    target,
    setProps,
    color,
    style,
    className,
    class_name,
    n_clicks = 0,
    ...otherProps
  } = props;

  const incrementClicks = () => {
    if (!disabled && setProps) {
      setProps({n_clicks: n_clicks + 1});
    }
  };
  const isBootstrapColor = bootstrapColors.has(color);
  const useLink = href && !disabled;
  otherProps[useLink ? 'preOnClick' : 'onClick'] = incrementClicks;

  return (
    <RBListGroupItem
      as={useLink ? Link : 'li'}
      href={href}
      target={useLink ? target : undefined}
      disabled={disabled}
      variant={isBootstrapColor ? color : null}
      style={!isBootstrapColor ? {backgroundColor: color, ...style} : style}
      className={class_name || className}
      {...otherProps}
      data-dash-is-loading={getLoadingState() || undefined}
    >
      {children}
    </RBListGroupItem>
  );
};

ListGroupItem.propTypes = {
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id: PropTypes.string,

  /**
   * The children of this component
   */
  children: PropTypes.node,

  /**
   * Defines CSS styles which will override styles previously set.
   */
  style: PropTypes.object,

  /**
   * Often used with CSS to style elements with common properties.
   */
  class_name: PropTypes.string,

  /**
   * **DEPRECATED** Use `class_name` instead.
   *
   * Often used with CSS to style elements with common properties.
   */
  className: PropTypes.string,

  /**
   * A unique identifier for the component, used to improve
   * performance by React.js while rendering components
   * See https://reactjs.org/docs/lists-and-keys.html for more info
   */
  key: PropTypes.string,

  /**
   * HTML tag to use for the listgroupitem, default: li
   */
  tag: PropTypes.string,

  /**
   * Apply active style to item
   */
  active: PropTypes.bool,

  /**
   * Apply disabled style to item
   */
  disabled: PropTypes.bool,

  /**
   * Item color, options: primary, secondary, success, info, warning,
   * danger, or any valid CSS color of
   * your choice (e.g. a hex code, a decimal code or a CSS color name)
   * default: secondary
   */
  color: PropTypes.string,

  /**
   * Apply list-group-item-action class for hover animation etc.
   */
  action: PropTypes.bool,

  /**
   * Pass a URL (relative or absolute) to make the list group item a link.
   */
  href: PropTypes.string,

  /**
   * If true, the browser will treat this as an external link,
   * forcing a page refresh at the new location. If false,
   * this just changes the location without triggering a page
   * refresh. Use this if you are observing dcc.Location, for
   * instance. Defaults to true for absolute URLs and false
   * otherwise.
   */
  external_link: PropTypes.bool,

  /**
   * An integer that represents the number of times
   * that this element has been clicked on.
   */
  n_clicks: PropTypes.number,

  /**
   * Target attribute to pass on to the link. Only applies to external links.
   */
  target: PropTypes.string
};

export default ListGroupItem;
