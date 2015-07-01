# gulp-contains [![Build Status](https://travis-ci.org/callumacrae/gulp-contains.svg?branch=master)](https://travis-ci.org/callumacrae/gulp-contains)

Throws an error or calls a callback if a given string is found in a file.

Useful for dumb quality checking.

## Install

```
$ npm install --save-dev gulp-contains
```

## Usage

The following code will throw an error if "../node_modules" is found in any
Sass or SCSS file.

```js
var gulp = require('gulp');
var contains = require('gulp-contains');

gulp.task('default', function () {
	gulp.src('./src/**/*.{sass, scss}')
		.pipe(contains('../node_modules'));
});
```

The contains function accepts either a string, regex or an array of strings (any of
which, when matched, will cause an error to be thrown).

You can also specify an onFound or onNotFound callbacks, in which you can handle the error
yourself or choose to completely ignore it:

```js
var gulp = require('gulp');
var contains = require('gulp-contains');

gulp.task('default', function () {
	gulp.src('./src/**/*.{sass, scss}')
		.pipe(contains({
			search: '../node_modules',
			onFound: function (string, file, cb) {
				// string is the string that was found
				// file is the vinyl file object
				// cb is the through2 callback

				// default: throws an error

				// return false to continue the stream or true to stop the stream
			},
			onNotFound: function (file, cb) {
				// file is the vinyl file object
				// cb is the through2 callback

				// default: continues the stream

				// return false to continue the stream or true to stop the stream
			}
		}));
});
```

Regex

```js
    .pipe(plugins.contains({
      search: /([ \t]*\n){4,}/, // Looks for multiple empty lines
      regex: true,
      onFound: function(string, file, cb) {
        gutil.log(gutil.colors.red(filename(file), 'Not cleaned'));
      },
      onNotFound: function(file, cb) {
        gutil.log(gutil.colors.green(filename(file), 'Is clean'));
      }
    }))
```

## License

Released under the MIT license.
