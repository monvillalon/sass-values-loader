# `sass-values-loader`

`sass-values-loader` is a Webpack loader that allows you share the values of your Sass files with your javascript when using webpack.

## Installation

```sh
npm install --save-dev sass-values-loader node-sass
```

or if you use yarn

```sh
yarn add --dev sass-values-loader node-sass
```

as a peer dependency you need to install `node-sass` if you don't have it already

## Setup & usage

Assuming you have a scss file like this, called `style.scss`:

```scss
$bool: true;
$color: red;
$list: (1,2,3);
$number: 1;
$map: (key: 2, key2: true);
$null: null;
$string: 'string value';
$ms: 500ms;
$sec: 10s;

.myclass {
  color: $color;
}
```

in your JavaScript file (wherever you need the values from Sass), you can do this:

```js
import styles from './style.scss';
import vars from '!!sass-values-loader!./style.scss';

console.log(vars.bool) // true
console.log(vars.color) // 'rgba(255,0,0,1)'
console.log(vars.list) // [1,2,3]
console.log(vars.number) // 1
console.log(vars.string) // 'string value'
console.log(vars.ms) // 500
console.log(vars.sec) // 10

console.log(styles.a) // The css modules classname
```

You should call this plugin explicitly when you want to gather the variables of a file instead of adding it to your Webpack config, so that you won't change how your stylesheets are loaded.

You can, however, clean up the syntax. First, add an alias in your Webpack config file:

```js
module.exports = {
	// ...

	resolveLoader: {
		alias: {
			'sass-js': 'sass-values-loader',
		},
	},

	// ...
}
```

now you can use the plugin in your scripts like this:

```js
import vars from '!!sass-js!./style.scss';
```

## Options

### `preserveKeys` (default `false`)

Variable names are converted to camelCase by default, but can be preserved in their original format with this setting.

```scss
$some-time: 500ms,
```

```js
import styles from './style.scss';
import camelCasedVars from '!!sass-values-loader!./style.scss';
import preservedVars from '!!sass-values-loader?preserveKeys=true!./style.scss';

console.log(camelCasedVars) // { someTime: 500 }
console.log(preservedVars) // { 'some-time': 500 }
```

## How it works

The loader works in two phases.

1. Transform the original Sass file (using [scss-parser](https://www.npmjs.com/package/scss-parser) and [query-ast](https://www.npmjs.com/package/query-ast)), so that this:

```scss
$my_var: 20 + 10;
```

becomes this:

```scss
$my_var: export_var(20 + 10);
```

This is done as the last step, so all the full Sass syntax should be supported.

2. The Sass code is fed through [node-sass](https://github.com/sass/node-sass), while registering the custom `export_var` function. During compilation `node-sass` will call the function with the resolved value and we can capture it then.

This way Sass does the resolution of the final values, even if they are computed via functions or if they depend on imported files.

## Common issues with similar libraries

Other projects attempting to let you export variable values from Sass to JS suffer from some or all of the following problems.

1. Using regexp to read Sass line-by-line, so that the Sass syntax is not actually parsed
2. Not working with Webpack 2.
3. Not supporting lists, maps, multi-line values or @imports
4. Not supporting the full range different types and units that Sass offers
5. Not resolving the final computed values of variables used in the file
