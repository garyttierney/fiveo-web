# fiveo-web

A fuzzy text searching library for the modern web built with [TypeScript](https://www.typescriptlang.org/) and [Rust](https://www.rust-lang.org).

[![Travis](https://img.shields.io/travis/garyttierney/fiveo-web.svg)](https://travis-ci.org/garyttierney/fiveo-web)
[![npm](https://img.shields.io/npm/v/fiveo-web.svg)](https://npmjs.com/fiveo-web)
[![license](https://img.shields.io/github/license/garyttierney/fiveo-web.svg)](LICENSE)

## Introduction

An example using React can be found [here](https://codesandbox.io/s/3q84085j36) by [@stephenwf](https://github.com/stephenwf)

`fiveo-web` can be used to efficiently find approximate string matches across large in-memory dictionaries.  The aim is to use emerging web technologies to beat the performance of existing solutions.

## Requirements

`fiveo-web` is built on modern web technologies and requires implementations of two work in progress specifications to run:

* [WebAssembly](https://caniuse.com/#feat=wasm)<sup>1</sup>
* [TextEncoding](https://caniuse.com/#feat=textencoder)<sup>2</sup>

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

## Benchmarks

`fiveo-web` ships with a single benchmark that indexes a subset of an English dictionary.  It can be ran by building the benchmark with webpack:

```shell
> $ npx webpack
```

Then running it from the shell or including the resulting script on a web page:
```shell
> $ node dist/english_dictionary_bench_suite
english_word_list (310k entries) x 703 ops/sec ±0.00% (1 run sampled)
english_word_list (310k entries) x 769 ops/sec ±7.82% (2 runs sampled)
english_word_list (310k entries) x 789 ops/sec ±13.53% (3 runs sampled)
english_word_list (310k entries) x 824 ops/sec ±10.13% (4 runs sampled)
english_word_list (310k entries) x 820 ops/sec ±9.22% (5 runs sampled)
english_word_list (310k entries) x 772 ops/sec ±7.92% (6 runs sampled)
english_word_list (310k entries) x 811 ops/sec ±6.39% (7 runs sampled)
english_word_list (310k entries) x 808 ops/sec ±5.65% (8 runs sampled)
english_word_list (310k entries) x 766 ops/sec ±5.04% (9 runs sampled)
```
## Contributing

Contributions via GitHub are welcome.  Please follow the standard [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) commit format.

## Licensing

`fiveo-web` is licensed under the ISC license.  Please see the `LICENSE` file for more information.