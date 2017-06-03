'use strict';

const PassThrough = require('stream').PassThrough;
const mimicResponse = require('mimic-response');

const cloneResponse = response => {
	const clone = new PassThrough();
	mimicResponse(response, clone);

	return response.pipe(clone);
};

module.exports = cloneResponse;
