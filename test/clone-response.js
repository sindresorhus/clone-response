import http from 'http';
import test from 'ava';
import rfpify from 'rfpify';
import getStream from 'get-stream';
import createTestServer from 'create-test-server';
import cloneResponse from '../';

let s;
const responseText = 'Hi!';

test.before(async () => {
	s = await createTestServer();

	s.get('/', (req, res) => {
		res.send(responseText);
	});
});

test('cloneResponse is a function', t => {
	t.is(typeof cloneResponse, 'function');
});

test('streaming a response twice should fail', async t => {
	const response = await rfpify(http.get)(s.url + '/');
	const firstStream = await getStream(response);
	const secondStream = await getStream(response);

	t.is(firstStream, responseText);
	t.is(secondStream, '');
});

test('streaming multiple cloned responses succeeds', async t => {
	const response = await rfpify(http.get)(s.url + '/');
	const clonedResponse = cloneResponse(response);
	const firstStream = await getStream(response);
	const clonedStream = await getStream(clonedResponse);

	t.is(firstStream, responseText);
	t.is(clonedStream, responseText);
});

test('known properties are copied over', async t => {
	const response = await rfpify(http.get)(s.url + '/');
	const clonedResponse = cloneResponse(response);

	cloneResponse.knownProps.forEach(prop => t.true(typeof clonedResponse[prop] !== 'undefined'));
});

test('custom properties are copied over', async t => {
	const response = await rfpify(http.get)(s.url + '/');
	response.foo = 'bar';
	const clonedResponse = cloneResponse(response);

	t.is(clonedResponse.foo, 'bar');
});

test('function methods are bound to the original response instance', async t => {
	const response = await rfpify(http.get)(s.url + '/');
	response.getThis = function () {
		return this;
	};
	const clonedResponse = cloneResponse(response);

	t.is(response.getThis(), clonedResponse.getThis());
});
