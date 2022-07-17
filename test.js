import http from 'node:http';
import {PassThrough} from 'node:stream';
import test from 'ava';
import pify from 'pify';
import getStream from 'get-stream';
import createTestServer from 'create-test-server';
import cloneResponse from './index.js';

const get = pify(http.get, {errorFirst: false});

let s;
const responseText = 'Hi!';

test.before(async () => {
	s = await createTestServer();

	s.get('/', (request, response) => {
		response.send(responseText);
	});
});

test.after('cleanup', async () => {
	await s.close();
});

test('cloneResponse is a function', t => {
	t.is(typeof cloneResponse, 'function');
});

test('returns a new PassThrough stream', async t => {
	const response = await get(s.url);
	const clonedResponse = cloneResponse(response);

	t.true(clonedResponse instanceof PassThrough);
});

test('throws TypeError if response is not passed in', t => {
	t.throws(() => {
		cloneResponse();
	}, {
		message: 'Parameter `response` must be a response stream.',
	});
});

test('streaming a response twice should fail', async t => {
	const response = await get(s.url);
	const firstStream = await getStream(response);
	const secondStream = await getStream(response);

	t.is(firstStream, responseText);
	t.is(secondStream, '');
});

test('streaming multiple cloned responses succeeds', async t => {
	const response = await get(s.url);
	const clonedResponse = cloneResponse(response);
	const firstStream = await getStream(response);
	const clonedStream = await getStream(clonedResponse);

	t.is(firstStream, responseText);
	t.is(clonedStream, responseText);
});

test('custom properties are copied over', async t => {
	const response = await get(s.url);
	response.foo = 'bar';
	const clonedResponse = cloneResponse(response);

	t.is(clonedResponse.foo, 'bar');
});

test('function methods are bound to the original response instance', async t => {
	const response = await get(s.url);

	response.getContext = function () {
		return this;
	};

	const clonedResponse = cloneResponse(response);

	t.is(response.getContext(), clonedResponse.getContext());
});
