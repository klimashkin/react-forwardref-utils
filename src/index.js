import React, {forwardRef} from 'react';
import hoistStatics from 'hoist-non-react-statics';

/**
 * Tests if Component is produced by forwardRef function
 * @param Component
 * @returns {boolean}
 */
export const isForwardRef = Component => Component.$$typeof && typeof Component.render === 'function';

/**
 * Use just a string for now (react 16.3), since react doesn't support Symbols in props yet
 * https://github.com/facebook/react/issues/7552
 * @type {string}
 */
export const forwardRefSymbol = '__forwardRef__';

/**
 * Wraps passed component with react 'forwardRef' function, which produce new component with type 'object' and structure like so:
 * { $$type: Symbol(), render: function }
 * Assigns (hoists) static methods of passed component to result forward component using 'hoist-non-react-statics' module.
 *
 * @param {Object|Function} Component - Component to wrap with forwardRef
 * @param {Object} [options] - Optional parameters
 * @param {String} [options.displayName] - Name of the result component that will be used in devtools.
 *                                         Will be taken from source component if omitted
 * @param {Object|Function} [options.hoistSource] - Source for taking static methods for assigning them to result component.
 *                                         In case you want to wrap with forwardRef another wrapper of original component,
 *                                         but methods should be copied from original
 * @param {Object} [options.hoistExclude] - Object to exclude some methods from hoisting, third parameter of hoist-non-react-statics module.
 *                                         By default excludes forwardRef component properties in case we wrap another forwardRef component.
 *                                         Until https://github.com/mridgway/hoist-non-react-statics/issues/48 is resolved
 * @returns {Object}
 */
export const forwardRefFactory = (
  Component,
  {displayName, hoistSource = Component, hoistExclude = {$$typeof: true, render: true}} = {}
) => {
  const forwardFn = (props, ref) => <Component {...{[forwardRefSymbol]: ref, ...props}}/>;

  forwardFn.displayName = displayName || Component.displayName || Component.name;

  const forwarder = forwardRef(forwardFn);

  hoistStatics(forwarder, hoistSource, hoistExclude);

  return forwarder;
};

/**
 * Simple HOC that uses forwardRefFactory
 * @param [options] - Options for forwardRefFactory
 * @returns {Object}
 */
export function withForwardRef(options) {
  return Component => forwardRefFactory(Component, options);
}