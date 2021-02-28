'use strict';
const Store = require('electron-store');

module.exports = new Store({
	defaults: {
		backgroundUrl: 'https://example.com/'
	}
});
