Standalone widget for comment count

## Installation

```
npm install --save guardian-comment-count
```

Alternatively you can use JSPM or any other package manager that supports NPM.



## Usage

In your HTML use the custom tag

```html
<comment-count></comment-count>
```

In your JavaScript

```js
import { refreshCount } from 'guardian-comment-count';

// Somewhere after page load
refreshCount({
    apibase: '//api.comments.com'
});
```

The widget will load the comment count of all custom tags in the page, batching requests. Once results are back, it'll simply append the text value to the tags.

You can style the custom tags independently of this widget as any other HTML tag.

### Dependencies

The widget runs on modern browsers and assumes the following features are available

* `Promise`, [polyfill](https://github.com/taylorhakes/promise-polyfill)
* `Array.from`, you can polifyll with [es6-shim](https://github.com/paulmillr/es6-shim)



## Local development

The widget is written in ES2015 and transpiled to ES5 through babel + rollup.

### Unit test

Tests run in Karma + Jasmine and collect coverage report with istanbul.

```
npm test
```

### Watch unit tests

```
npm run dev
```

Alternatively you can run `karma start` if installed globally.

Runs karma in auto-watch mode. You can then connect your browser to `http://localhost:9876/debug.html` to run the tests locally.

Tests and source files are automatically transpiled with inline source maps.

### Integration

If you want to test the full widget integration inside a standalone page run

```
npm run example
```

and open a browser to `http://localhost:4000`

The server automatically watches your source files and transpiles them using rollup.
