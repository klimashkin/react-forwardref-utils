# react-forwardref-utils
Utils to help with React 16.3+ [forwardRef](https://reactjs.org/docs/forwarding-refs.html) method

```bash
$ npm install --save react-forwardref-utils
```

## Usage

```js
import {
  isForwardRef, forwardRefSymbol, forwardRefFactory, withForwardRef,
} from 'react-forwardref-utils';
```

### `isForwardRef`
Tests if Component is produced by forwardRef function

```js
import {isForwardRef} from 'react-forwardref-utils';

const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

isForwardRef(FancyButton); // true

```

### `forwardRefSymbol`
Symbol (currently just a string) that points to the ref passed to a component that wrapped with `forwardRefFactory`.

### `forwardRefFactory(Component, [options])`
Wraps passed component with `forwardRef`, assigns its statics to result using [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) and provide special symbol to take ref from parent call. 

```js
import {forwardRefFactory, forwardRefSymbol} from 'react-forwardref-utils';

class Button extends React.Component {
  render () {
    const {[forwardRefSymbol]: ref, ...props} = this.props;
    
    props.ref = ref;
    props.className = "FancyButton";
    
    return <button {...props}>{props.children}</button>;
  }
}

export default forwardRefFactory(Button/*, {displayName, hoistSource, hoistExclude}*/);
```
###### Options:
- `displayName` *(String)* Name of the result component that will be used in devtools. Will be taken from source component if omitted.
- `hoistSource` *(Object|Function)* Source for taking static methods for assigning them to result component.  In case you want to wrap with forwardRef another wrapper of original component, but methods should be copied from original. For instance, when you write HOC and wrap that HOC with forwardRefFactory - statics should be copied from original component, not from the HOC.
- `hoistExclude` *(Object)* Object to exclude some methods from hoisting, third parameter of hoist-non-react-statics module. By default excludes forwardRef component properties in case we wrap another forwardRef component (until https://github.com/mridgway/hoist-non-react-statics/issues/48 is resolved).

### `withForwardRef([options])`
Decorator that wraps decorated component with `forwardRefFactory`.

```js
import {withForwardRef, forwardRefSymbol} from 'react-forwardref-utils';

@withForwardRef()
export default class Button extends React.Component {
  render () {
    const {[forwardRefSymbol]: ref, ...props} = this.props;
    
    props.ref = ref;
    props.className = "FancyButton";
    
    return <button {...props}>{props.children}</button>;
  }
}
```


## License
[MIT](https://github.com/klimashkin/react-forwardref-utils/blob/master/LICENSE)

[LICENSE file]: https://github.com/klimashkin/react-forwardref-utils/blob/master/LICENSE