'use strict';

var through = require('through2');
var gutil = require('gulp-util');

module.exports = function gulpContains(options) {
    if (typeof options === 'string' || Array.isArray(options)) {
        options = {
            search: options,
            regex: false
        };
    }

    options.onFound = options.onFound || function (string, file, cb) {
            var error = 'Your file contains "' + string + '", it should not.';
            cb(new gutil.PluginError('gulp-contains', error));
        };

    options.onNotFound = options.onNotFound || function () {
            return false;
        };

    return through.obj(function (file, enc, cb) {
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

        if (!options.regex) {
            found = stringContains(file.contents.toString(enc), options.search);
        } else {
            var pattern = new RegExp(options.search);
            var contents = String(file.contents);

            var matches = contents.match(pattern);
            if (matches) {
                found = true;
            }
        }

        if (found) {
            var cancel = options.onFound(found, file, cb);

            if (cancel === true) {
                return;
            }
        } else {
            var cancel = options.onNotFound(file, cb);

            if (cancel === true) {
                return;
            }
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
