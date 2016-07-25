Standalone widget for comment count

## Installation

```
npm install --save guardian-comment-count
```

Alternatively you can use JSPM or any other package manager that supports NPM.



## Usage

In your HTML use the custom tag

```html
<comment-count data-discussion-id="1234"></comment-count>
```

In your JavaScript

```js
import { load as loadCommentCount } from 'guardian-comment-count';

// Somewhere after page load
loadCommentCount({
    apiBase: '//api.comments.com',
    apiQuery: 'ids'
});
```

The widget will load the comment count of all custom tags in the page, batching requests. Once results are back, it'll simply append the text value to the tags.

You can style the custom tags independently of this widget as any other HTML tag.

### Dependencies

The widget runs on modern browsers and assumes the following features are available

* `Promise`, [polyfill](https://github.com/taylorhakes/promise-polyfill)
* `fetch`, [polyfill](https://github.com/github/fetch)

You can use dependency injection to pass them in case you're not using a polyfill.


#### Peer dependencies

Some libraries are kept as peer dependencies, users of this widget will have to provide them.

* `fastdom`



### Advanced Usage

#### Number formatting

By default the widget's text is set to whatever values comes from the server.
You can apply custom formatting (e.g. convert from 1000 to 1,000) using the optional `format` function

```js
import { load } from 'guardian-comment-count';
import { numberFormatting } from 'number-utility';

load({
    format: numberFormatting
});
```

#### Filtering

You might want to skip the comment count for certain elements depending on your A/B tests or other configuration. The `filter` function receives the custom DOM elements and works like `Array.filter`, return `true` to keep loading the comment count or `false` to skip it.

```js
import { load } from 'guardian-comment-count';

load({
    filter (node) {
        // node is the custom DOM element
        const anything = node.getAttribute('data-anything');
        return ABTest.running() === anything;
    }
});
```

#### Update count

If you want to update the count of all elements you can simply call `load` again, but if you only want to load the value of nodes that haven't been loaded yet (for instance because you're ajax-ing in new one) you can call

```js
import { load, update } from 'guardian-comment-count';

const widgetConfig = {
    apiBase: '//api.comments.com',
    apiQuery: 'ids'
};

load(widgetConfig);

eventBus.on('new-elements-added-to-the-page', () => {
    update(widgetConfig);
});
```

#### Error reporting

Both `load` and `update` return a `Promise`

```js
import { load } from 'guardian-comment-count';

load({})
.then(() => {
    // All elements have been updated
})
.catch(error => {
    // Something's wrong
});
```

#### Update callback

Pass an optional callback to be notified of changes on custom tags

```js
import { load } from 'guardian-comment-count';

load({
    onupdate: (node, count) => {
        // node is the DOM element
        // count the numerical comment count
    }
})
.catch(error => {
    // Errors in the onupdate method bubble up here
});
```

You can use the callback for instance to hide the icon of discussions with 0 comments.
By default the widget does not set the text to `0`.

### Dependency Injection

```js
import { load } from 'guardian-comment-count';
import { Promise } from 'bluebird';
import { customFetch } from 'fetch';

load({
    fetch: customFetch,
    Promise: Promise
});
```



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
