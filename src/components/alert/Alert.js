import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {omit} from 'ramda';
import RBAlert from 'react-bootstrap/Alert';
import {bootstrapColors} from '../../private/BootstrapColors';
import {getLoadingState} from '../../private/util';

/**
 * Alert allows you to create contextual feedback messages on user actions.
 *
 * Control the visibility using callbacks with the `is_open` prop, or set it to
 * auto-dismiss with the `duration` prop.
 */
const Alert = ({
  children,
  dismissable,
  setProps,
  style,
  class_name,
  className,
  fade,
  color = 'success',
  is_open = true,
  duration = null,
  ...otherProps
}) => {
  const timeout = useRef(null);

  useEffect(() => {
    if (duration) {
      if (is_open) {
        timeout.current = setTimeout(dismiss, duration);
      } else if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    }
    return () => clearTimeout(timeout.current);
  }, [is_open]);

  const dismiss = () => {
    if (setProps) {
      setProps({is_open: false});
    }
  };

  const isBootstrapColor = bootstrapColors.has(color);
  return (
    <RBAlert
      show={is_open}
      dismissible={dismissable}
      onClose={dismissable ? dismiss : null}
      variant={isBootstrapColor ? color : null}
      className={class_name || className}
      transition={fade}
      style={!isBootstrapColor ? {backgroundColor: color, ...style} : style}
      {...omit(
        ['persistence', 'persisted_props', 'persistence_type', 'setProps'],
        otherProps
      )}
      data-dash-is-loading={getLoadingState() || undefined}
    >
      {children}
    </RBAlert>
  );
};

Alert.dashPersistence = {
  persisted_props: ['is_open'],
  persistence_type: 'local'
};

Alert.propTypes = {
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id: PropTypes.string,

  /**
   * The children of this component.
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
   * Alert color, options: primary, secondary, success, info, warning, danger,
   * link or any valid CSS color of
   * your choice (e.g. a hex code, a decimal code or a CSS color name)
   * Default: secondary.
   */
  color: PropTypes.string,

  /**
   * Whether alert is open. Default: True.
   */
  is_open: PropTypes.bool,

  /**
   * If True, a fade animation will be applied when `is_open` is toggled. If
   * False the Alert will simply appear and disappear.
   */
  fade: PropTypes.bool,

  /**
   * If true, add a close button that allows Alert to be dismissed.
   */
  dismissable: PropTypes.bool,

  /**
   * Duration in milliseconds after which the Alert dismisses itself.
   */
  duration: PropTypes.number,

  /**
   * Used to allow user interactions in this component to be persisted when
   * the component - or the page - is refreshed. If `persisted` is truthy and
   * hasn't changed from its previous value, a `value` that the user has
   * changed while using the app will keep that change, as long as
   * the new `value` also matches what was given originally.
   * Used in conjunction with `persistence_type`.
   */
  persistence: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),

  /**
   * Properties whose user interactions will persist after refreshing the
   * component or the page. Since only `value` is allowed this prop can
   * normally be ignored.
   */
  persisted_props: PropTypes.arrayOf(PropTypes.oneOf(['is_open'])),

  /**
   * Where persisted user changes will be stored:
   * memory: only kept in memory, reset on page refresh.
   * local: window.localStorage, data is kept after the browser quit.
   * session: window.sessionStorage, data is cleared once the browser quit.
   */
  persistence_type: PropTypes.oneOf(['local', 'session', 'memory'])
};

export default Alert;
