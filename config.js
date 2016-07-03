'use strict';

module.exports = {
	mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
	debug: process.env.NODE_ENV !== 'production' ? true : false
}