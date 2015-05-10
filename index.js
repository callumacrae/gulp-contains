'use strict';

var through = require('through2');
var gutil = require('gulp-util');

module.exports = function gulpContains(options) {
	if (typeof options === 'string' || Array.isArray(options)) {
		options = {
			search: options
		};
	}

	options.onFound = options.onFound || function(string, file, cb) {
		var error = 'Your file contains "' + string + '", it should not.';
		cb(new gutil.PluginError('gulp-contains', error));
	};

	options.onNotFound = options.onNotFound || function(string, file, cb) {
		// var error = 'Your file does not contains "' + string + '", it should.';
		// cb(new gutil.PluginError('gulp-contains', error));
	};

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-contains', 'Streaming not supported'));
			return;
		}

		if (!options.search) {
			cb(new gutil.PluginError('gulp-contains', 'You did not specify a valid search string'));
			return;
		}

		var found = false;

		if (!options.reg) {
			found = stringContains(file.contents.toString(enc), options.search);
		} else {
			// if (typeof options.search === 'string') {
				var pattern = new RegExp(options.search);
				var contents = String(file.contents);

				var matches = contents.match(pattern);
				if (matches) {
					found = true;
				}

			// } else if (!options.search instanceof RegExp) {
			// 	throw new gutil.PluginError('gulp-check', 'Pattern must be a string or regular expression');
			// }
		}

		if (found) {
			// You can return false to ignore the error
			var cancel = options.onFound(found, file, cb);
			// console.log('Found', file.path);

			// if (cancel !== false) {
			// 	return;
			// }
		} else {

			var cancel = options.onNotFound(found, file, cb);

			// if (cancel !== false) {
			// 	return;
			// }
		}

		cb(null, file);
	});
};

function stringContains(str, search) {
	if (typeof search === 'string') {
		return (str.indexOf(search) !== -1) ? search : false;
	}

	for (var i = 0; i < search.length; i++) {
		if (stringContains(str, search[i])) {
			return search[i];
		}
	}

	return false;
}
