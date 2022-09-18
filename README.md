# flex-splitter-directive

Dead simple panes splitter control based on flexbox.

[Demo](https://luncheon.github.io/flex-splitter-directive/)

* **Declarative.**  
  Just add an attribute to the DOM element. Don't need to write any JavaScript.
* **Lightweight.**  
  JS + CSS ~ 1.2kB (gzipped) with no dependencies.


## Installation

### [npm](https://www.npmjs.com/package/flex-splitter-directive) (with a module bundler)

```sh
$ npm i flex-splitter-directive
```

```js
import "flex-splitter-directive"
import "flex-splitter-directive/styles.min.css"
```

### CDN ([jsDelivr](https://www.jsdelivr.com/package/npm/flex-splitter-directive))

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flex-splitter-directive@0.5.1/styles.min.css">
<script src="https://cdn.jsdelivr.net/npm/flex-splitter-directive@0.5.1"></script>
```

### Download Directly

* [index.js](https://cdn.jsdelivr.net/npm/flex-splitter-directive@0.5.1/index.js)
* [styles.min.css](https://cdn.jsdelivr.net/npm/flex-splitter-directive@0.5.1/styles.min.css)


## Usage

1. Load CSS and JS.
2. Set `data-flex-splitter-horizontal` (or `data-flex-splitter-vertical` for vertical) attribute to the parent element of the panes.
    * Optionally, specify the `keyboard-movement` option, as in `data-flex-splitter-horizontal="keyboard-movement:10"`.
3. Insert `<div role="separator" tabindex="1"></div>` between each pane.
4. Set the following styles for each pane as required:
    * `width` / `height` for the initial size.
    * `min-width` / `min-height` for the minimum size.
    * `max-width` / `max-height` for the maximum size.
    * `flex: auto` for filling space.


## License

[WTFPL](http://www.wtfpl.net/)


## Other vanilla-js panes splitters

* [Split (nathancahill/split)](https://github.com/nathancahill/split)
* [Splitter (andrienko/splitter)](https://github.com/andrienko/splitter)
* [SplitMe (alesgenova/split-me)](https://github.com/alesgenova/split-me)
