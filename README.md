# tailwindcss-view-transitions

[![NPM package version](https://img.shields.io/npm/v/tailwindcss-view-transitions)](https://www.npmjs.com/package/tailwindcss-view-transitions)

A plugin for customizing styles for the [View Transitions Web API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API).

## Installation

```sh
npm install -D tailwindcss-view-transitions
```

Then add the plugin to your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require("tailwindcss-view-transitions"),
    // ...
  ],
}
```

## Usage

Use the `vt-name-[ANY_STRING]` utility class to [create a separate view transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#different_transitions_for_different_elements) on specific elements.

```html
<div class="vt-name-[main-header]">
</div>
```

Use `vt-name-none` to disable a view transition. Can be used with any Tailwind variant, such as `md:*`.

```html
<div class="vt-name-[main-header] md:vt-name-none">
</div>

<div class="vt-name-[main-header] motion-reduce:vt-name-none">
</div>
```

The name can be any string except `root` (❌ `vt-name-[root]`), which is reserved for the default top-level view transition.

| Class  | CSS properties |
| ---  | --- |
| `vt-name-[foo]` |  `view-transition-name: foo;` |
| `vt-name-[foo-bar]` |  `view-transition-name: foo-bar;` |
| `vt-name-none` |  `view-transition-name: none;` |

### Styling with CSS

Style the view transition pseudo-elements from your global CSS file.

```css
/* input.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
}

::view-transition-old(main-content) {
  /* Add custom animation or style here */
  /* animation: ... */
}

::view-transition-new(main-content) {
  /* Add custom animation or style here */
  /* animation: ... */
}
```

### Configuration

Alternatively, you can define styles from plugin configuration in your `tailwind.config.js` file.

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require("tailwindcss-view-transitions")({
      disableAllReduceMotion: false,
      styles: {
        // ...
      },
    }),
    // ... other plugins
  ],
}
```

## Options

The plugin config accepts an options object as argument which contains these properties. All are optional.

### `disableAllReduceMotion`

- Type: `boolean`
- Default: `false`

Disables _all_ view transitions animation if user has set preference for reduced motion. (Note: Consider [this point](https://developer.chrome.com/docs/web-platform/view-transitions/#:~:text=a%20preference%20for%20%27reduced%20motion%27%20doesn%27t%20mean%20the%20user%20wants%20no%20motion) before disabling animations completely.)

If `true`, it applies this code globally:

```css
@media (prefers-reduced-motion) {
  ::view-transition-group(*),::view-transition-old(*),::view-transition-new(*) {
    animation: none !important;
  }
}
```

### `styles`

- Type: `Record<string, CSSRuleObject & { old?: CSSRuleObject; new?: CSSRuleObject }>`
- Default: `{}`

Defines CSS styles for the view transition pseudo-elements.

The styles object may contain any number of properties. 

- The **key** is the view transition name (`root` or any string value assigned [here](#usage))
- The **value** is one or more of these:
  - a [CSS rule object](https://github.com/tailwindlabs/tailwindcss/blob/9faf10958b880067cacdd0ef3c4bf9e64172ed91/types/config.d.ts#L15), which will be applied to both outgoing (`::view-transition-old(VT_NAME)`) and incoming (`::view-transition-new(VT_NAME)`) pseudo-elements
  - a propery `old` containing a CSS rule object, which will be applied only to `::view-transition-old(VT_NAME)`
  - a propery `new` containing a CSS rule object, which will be applied only to `::view-transition-new(VT_NAME)`

| styles config  | Generated CSS |
| ---  | --- |
| <pre>{ <br/>  root: { animation: "none" },<br/>}</pre> | <pre>::view-transition-old(root),<br/>::view-transition-new(root) {<br/>  animation: none;<br/>}</pre> |
| <pre>{ <br/>  root: { <br/>    old: { animationDuration: "1s" },<br/>    new: { animationDuration: "3s" },<br/>  },<br/>}</pre> | <pre>::view-transition-old(root) {<br/>  animation-duration: 1s;<br/>}<br/>::view-transition-new(root) {<br/>  animation-duration: 3s;<br/>}</pre> |
| <pre>{ <br/>  root: { animation: "none" },<br/>  "main-content": { <br/>    old: { animationDuration: "1s" },<br/>    new: { animationDuration: "3s" },<br/>  },<br/>}</pre> | <pre>::view-transition-old(root),<br/>::view-transition-new(root) {<br/>  animation: none;<br/>}<br/><br/>::view-transition-old(main-content) {<br/>  animation-duration: 1s;<br/>}<br/>::view-transition-new(main-content) {<br/>  animation-duration: 3s;<br/>}</pre> |

⚠️ If applying custom CSS animation, you need to define `@keyframes` separately in your CSS file or through [Tailwind theme configuration](https://tailwindcss.com/docs/animation#customizing-your-theme), or alternatively use an existing `@keyframes` animation.

Detailed examples: https://github.com/ekafyi/tailwindcss-view-transitions/blob/main/docs/examples.md

## When not to use?

You may not need this plugin if:

* You don’t need to customize the [default browser transition styles](https://developer.chrome.com/docs/web-platform/view-transitions/#default-style-and-transition-reference)
* You do styling outside of Tailwind configuration
* You exclusively use a (meta)framework that has its own API for conveniently styling view transitions, such as [Astro](https://docs.astro.build/en/guides/view-transitions/)

As an unofficial plugin, it will be deprecated when/if Tailwind adds an official plugin for styling view transitions.

## Bugs & feature requests

While I'm not actively accepting feature requests, I outlined future plans in the [Discussions](https://github.com/ekafyi/tailwindcss-view-transitions/discussions).

Found a bug? Feel free to [open an issue](https://github.com/ekafyi/tailwindcss-view-transitions/issues).
