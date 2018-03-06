# fiveo-web

A fuzzy text searching library for the modern web built with [TypeScript](https://www.typescriptlang.org/) and [Rust](https://www.rust-lang.org).

![Travis](https://img.shields.io/travis/garyttierney/fiveo-web.svg)

![npm](https://img.shields.io/npm/v/fiveo-web.svg)

![license](https://img.shields.io/github/license/garyttierney/fiveo-web.svg)

## Introduction

An example using React can be found [here](https://codesandbox.io/s/3q84085j36) by [@stephenwf](https://github.com/stephenwf)

`fiveo-web` can be used to efficiently find approximate string matches across large in-memory dictionaries.  The aim is to use emerging web technologies to beat the performance of existing solutions.

## Requirements

`fiveo-web` is built on modern web technologies and requires implementations of two work in progress specifications to run:

* [WebAssembly](https://caniuse.com/#feat=wasm)<sup>1</sup>
* [TextEncoding](https://caniuse.com/#feat=textencoder)<sup>2</sup>

1: Recent versions of node.js supporting WebAssembly should also be able to use this library, although it hasn't been tested.

2: It may be possible to provide a shim for the TextEncoding specification on platforms lacking an implementation.

## Installation
 
 The package can be installed via npm:
 ```
 > $ npm install --save fiveo-web
 ```

 Then you can include it on your build, or directly on a web page, and start using it.

 ## Usage

`fiveo-web` exports a single function that can be called to asynchronously create a `Matcher`:

```js
const fiveo = require('fiveo-web');
const matcher = await fiveo.createBlockingMatcher([
    "entry 1", "entry 2", "entry 3"
]);
```

The `Matcher` can then be used to `search` for matches:

```js
const query = "entry";
const maxResults = 10;
const results = await matcher.search(query, maxResults);
```

## Building

After cloning the git repository and installing dependencies via `npm install`, a webpack build can be ran with `npm run build`.  This will output TypeScript declaration files and transpiled code to `dist/`.

## Contributing

Contributions via GitHub are welcome.  Please follow the standard [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) commit format.

## Licensing

`fiveo-web` is licensed under the ISC license.  Please see the `LICENSE` file for more information.