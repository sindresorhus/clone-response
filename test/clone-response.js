import test from 'ava';
import cloneResponse from '../';

test('cloneResponse is a function', t => {
	t.is(typeof cloneResponse, 'function');
});
