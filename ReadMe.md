# wanted-node-version

Detects which version of Node your program should be using, by looking at `.nvmrc`, `.node-version` and the
`engines.node` field of `package.json`.

## Installation

```sh
npm install wanted-node-version --save
```

## Usage

```js
const wantedNodeVersion = require('wanted-node-version');

const versionInfo = wantedNodeVersion(process.cwd());

console.log(versionInfo);
```

Outputs:

```
{ sources:
   { '.nvmrc': '8',
     '.node-version': undefined,
     'engines.node': undefined },
  version: '8',
  conflict: false }
```

- The `sources` property is an object that contains the version-range that was set for each source.
- The `version` property is a string containing the wanted node version-version from the first of `nvmrc`, `node-version`, `engines.node` (in that order).
- The `conflict` property tells you if all version ranges found are in conflict (`true`) or not (`false`).

## See also

To further deal with version-range strings, I recommend using the excellent
[semver](https://www.npmjs.com/package/semver) module.

## License

MIT
