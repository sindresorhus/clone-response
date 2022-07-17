import {PassThrough as PassThroughStream} from 'node:stream';
import mimicResponse from 'mimic-response';

export default function cloneResponse(response) {
	if (!(response && response.pipe)) {
		throw new TypeError('Parameter `response` must be a response stream.');
	}

	const clone = new PassThroughStream({autoDestroy: false});

	mimicResponse(response, clone);

	return response.pipe(clone);
}
