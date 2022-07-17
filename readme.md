# clone-response

> Clone a Node.js HTTP response stream

Returns a new stream and copies over all properties and methods from the original response giving you a complete duplicate.

This is useful in situations where you need to consume the response stream but also want to pass an unconsumed stream somewhere else to be consumed later.

## Install

```sh
npm install clone-response
```

## Usage

```js
import http from 'node:http';
import cloneResponse from 'clone-response';

http.get('http://example.com', response => {
	const clonedResponse = cloneResponse(response);
	response.pipe(process.stdout);

	setImmediate(() => {
		// The response stream has already been consumed by the time this executes,
		// however the cloned response stream is still available.
		doSomethingWithResponse(clonedResponse);
	});
});
```

Please bear in mind that the process of cloning a stream consumes it. However, you can consume a stream multiple times in the same tick, therefore allowing you to create multiple clones. For example:

```js
const clone1 = cloneResponse(response);
const clone2 = cloneResponse(response);
// The response can still be consumed in this tick but cannot be consumed if passed
// into any async callbacks. clone1 and clone2 can be passed around and be
// consumed in the future.
```

## API

### cloneResponse(response)

Returns a clone of the passed in response stream.

#### response

Type: `Stream`

A [Node.js HTTP response stream](https://nodejs.org/api/http.html#http_class_http_incomingmessage) to clone.
