# dep-shift

Move a package.json package to and from `dependencies/devDependencies`

A no thrills library that reads the line that you want to shift and move it into the other group without messing with file formatting that normal `JSON.parse/stringify` would.

## Usage

### With CLI

```sh
# defaults from devDependencies to dependencies
npx --yes dep-shift react
# from dependencies to devDependencies
npx --yes dep-shift react dependencies
```

### Install it into your toolchain first

```sh
yarn add -D dep-shift
yarn dep-shift react
```

### Use it programmatically

```js
const depShift = require('dep-shift');

depShift(
  process.cwd(),
  'react',
  // from,
  // to,
);
```
