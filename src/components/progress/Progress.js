import React, {cloneElement, useContext} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {map} from 'react-bootstrap/ElementChildren';
import {omit} from 'ramda';
import {getLoadingState} from '../../private/util';

import {bootstrapColors} from '../../private/BootstrapColors';

export const ProgressContext = React.createContext({});

/*
 * Bulk of this file is vendored from react-bootstrap/src/ProgressBar, but we
 * add the ability to style the bar which is needed for setting colors more
 * freely.
 */
const ROUND_PRECISION = 1000;

function getPercentage(now, min, max) {
  const percentage = ((now - min) / (max - min)) * 100;
  return Math.round(percentage * ROUND_PRECISION) / ROUND_PRECISION;
}

function renderProgressBar(
  {
    min,
    now,
    max,
    label,
    className,
    style,
    variant,
    barStyle,
    animated = false,
    isChild = false,
    visuallyHidden = false,
    striped = false,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      {...props}
      role="progressbar"
      className={classNames(className, `progress-bar`, {
        [`bg-${variant}`]: variant,
        [`progress-bar-animated`]: animated,
        [`progress-bar-striped`]: animated || striped
      })}
      style={{width: `${getPercentage(now, min, max)}%`, ...style, ...barStyle}}
      aria-valuenow={now}
      aria-valuemin={min}
      aria-valuemax={max}
    >
      {visuallyHidden ? (
        <span className="visually-hidden">{label}</span>
      ) : (
        label
      )}
    </div>
  );
}

const ProgressBar = React.forwardRef(
  ({isChild = false, min, max, ...props}, ref) => {
    if (isChild) {
      const context = useContext(ProgressContext);
      return renderProgressBar(
        {...props, max: max || context.max, min: min || context.min},
        ref
      );
    }

    const {
      now,
      label,
      visuallyHidden,
      striped,
      animated,
      variant,
      className,
      children,
      barStyle,
      ...wrapperProps
    } = props;

    min = min === undefined ? 0 : min;
    max = max === undefined ? 100 : max;

    return (
      <div
        ref={ref}
        {...wrapperProps}
        className={classNames(className, 'progress')}
      >
        <ProgressContext.Provider value={{min, max}}>
          {children
            ? map(children, child => cloneElement(child, {isChild: true}))
            : renderProgressBar(
                {
                  min,
                  now,
                  max,
                  label,
                  visuallyHidden,
                  striped,
                  animated,
                  variant,
                  barStyle
                },
                ref
              )}
        </ProgressContext.Provider>
      </div>
    );
  }
);

const Progress = ({
  children,
  color,
  className,
  class_name,
  value,
  bar,
  hide_label = false,
  ...otherProps
}) => {
  const isBootstrapColor = bootstrapColors.has(color);
  return (
    <ProgressBar
      className={class_name || className}
      {...omit(['setProps'], otherProps)}
      data-dash-is-loading={getLoadingState() || undefined}
      now={value}
      isChild={bar}
      variant={isBootstrapColor ? color : null}
      visuallyHidden={hide_label}
      barStyle={isBootstrapColor ? {} : {backgroundColor: color}}
    >
      {children}
    </ProgressBar>
  );
};

Progress.propTypes = {
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id: PropTypes.string,

  /**
   * The children of this component. Use this to nest progress bars.
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
   * Set to True when nesting Progress inside another Progress component to
   * create a multi-progress bar.
   */
  bar: PropTypes.bool,

  /**
   * Lower limit for value, default: 0
   */
  min: PropTypes.number,

  /**
   * Upper limit for value, default: 100
   */
  max: PropTypes.number,

  /**
   * Specify progress, value from min to max inclusive.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Adds a label to the progress bar.
   */
  label: PropTypes.string,

  /**
   * Set to True to hide the label.
   */
  hide_label: PropTypes.bool,

  /**
   * Animate the bar, must have striped set to True to work.
   */
  animated: PropTypes.bool,

  /**
   * Use striped progress bar
   */
  striped: PropTypes.bool,

  /**
   * Set color of the progress bar, options: primary, secondary, success,
   * warning, danger, info or any valid CSS color
   * of your choice (e.g. a hex code, a decimal code or a CSS color name).
   */
  color: PropTypes.string
};

export default Progress;
