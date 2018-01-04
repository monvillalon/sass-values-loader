## About

**sass-values-loader** is an webpack loader that allows you share the values of your sass files with your javascript when using webpack

## Installation

```
npm install --save-dev sass-values-loader node-sass
```

or if you use yarn

```
yarn add --dev sass-values-loader node-sass
```

as a peer dependency you need to install `node-sass` if you don't have it already

## Setup & Usage

There is no webpack setup required, this loader should not
be added as part of the sass pipeline. Instead it should be called explicitly when you want to gather the variables of a file

Assuming you have a scss file like this, called `style.scss`

```scss
$bool: true;
$color: red;
$list: (1,2,3);
$number: 1;
$map: (key: 2, key2: true);
$null: null;
$string: "string value";
$ms: 500ms;
$sec: 10s;

.myclass {
  color: $color;
}

```

in your javascript file, you can do this:

```js
import styles from './style.scss';
import vars from "!!sass-values-loader!./style.scss";

console.log(vars.bool) // true
console.log(vars.color) // "rgba(255,0,0,1)"
console.log(vars.list) // [1,2,3]
console.log(vars.number) // 1
console.log(vars.string) // "string value"
console.log(vars.ms) // 500
console.log(vars.sec) // 10

console.log(styles.a) // The css modules classname
```

### Options

`preserveKeys` (boolean, defaults to `false`)

Variable names are converted to camelCase by default, but can be preserved in their original format with this setting.

```scss
$some-time: 500ms,
```

```js
import styles from './style.scss';
import camelCasedVars from "!!sass-values-loader!./style.scss";
import preservedVars from "!!sass-values-loader?preserveKeys=true!./style.scss";

console.log(camelCasedVars) // { someTime: 500 }
console.log(preservedVars) // { 'some-time': 500 }
```

### Cleaner loader syntax

To shorten the import or require statement you can add the following snippet to the root of your webpack configuration:

```js
	module.exports = {
	
     /* more config... */
	
	  resolveLoader: {
	    alias: {
	      vars: "sass-values-loader",
	    },
	  },
  
     /* more config... */
  }
```

and then when you require variables use it like this:

```
import vars from "!!vars!./style.scss";
```

## How it works

The loader works in two phases.  

1. On the first phase the loader transforms the
   the original sass file, using [scss-parser](https://www.npmjs.com/package/scss-parser) and [query-ast](https://www.npmjs.com/package/query-ast) to pass the values thru
   an export function. Such that this file:
   
   ```scss
   $my_var: 20 + 10;
   ```
   
   becomes
   
	```scss
   $my_var: export_var(20 + 10);
   ```
   
   this is done at ast, level meaning that the full of the
   sass syntax should be supported
   
2. As a second step the files is fed thru [node-sass](https://github.com/sass/node-sass) while registering the custom `export_var` function.  In the compilation process node-sass will call the function with the resolved value and we can capture it then.
	This way sass can do the resolution to the values,
	even if they are computed or if they depend on defined 	variables on imported files, just like sass would.

## Similar Projects
	
The are several projects that have tackled the problem, but all of them didn't serve the problems I was trying to solve for several reasons.

1. Most of them used regular expressions and didn't account, for the full range of the sass syntax

2. Some didn't seem to be working with webpack2

3. Some didn't have support for lists, maps or the whole of the different types and units that sass offers

4. Some just plainly didn't work

5. Some didn't try to resolve when variables used in the file were computed from other files up the chain.

Here is a list of some projects I've found, this may work for you depending on your needs and I thank them as they were indispensable in trying to find ways to solve the problem.
	
1. [https://github.com/buildo/sass-variables-loader](https://github.com/buildo/sass-variables-loader)

2. [https://github.com/hankmccoy/sass-to-js-var-loader](https://github.com/hankmccoy/sass-to-js-var-loader)

3. [https://github.com/nothinggift/mk-sass-variables-loader](https://github.com/nothinggift/mk-sass-variables-loader)

4. [https://github.com/nordnet/sass-variable-loader](https://github.com/nordnet/sass-variable-loader)

	





