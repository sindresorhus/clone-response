# clone-response

> Clone a Node.js response object

[![Build Status](https://travis-ci.org/lukechilds/clone-response.svg?branch=master)](https://travis-ci.org/lukechilds/clone-response)
[![Coverage Status](https://coveralls.io/repos/github/lukechilds/clone-response/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/clone-response?branch=master)
[![npm](https://img.shields.io/npm/v/clone-response.svg)](https://www.npmjs.com/package/clone-response)

Returns a new stream and copies over all properties and methods from the original response giving you a complete duplicate.

This is useful in situations where you need to consume the response stream but also want to pass an unconsumed stream somewhere else to be consumed later.

## Install

```shell
npm install --save clone-response
```

## Usage

```js
const cloneResponse = require('clone-response');
const { get } = require('http');

get('http://example.com', response => {
  const clonedResponse = cloneResponse(response);
  response.pipe(process.stdout);

  setImmediate(() => {
    // The response stream has already been consumed by the time this executes,
    // however the cloned response stream is still available.
    doSomethingWithResponse(clonedResponse);
  });
});
```

## License

MIT © Luke Childs
