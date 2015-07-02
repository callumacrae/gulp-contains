'use strict';

var contains = require('./');
var gutil = require('gulp-util');
var should = require('should');
var through = require('through2');

describe('gulp-contains tests', function () {
	it('shouldn\'t break good files', function (done) {
		var stream = contains('notfound');

		stream.on('data', function (file) {
			file.contents.length.should.be.above(5);
			done();
		});

		stream.write(new gutil.File({
			contents: new Buffer('something')
		}));
	});

	it('should error on bad files', function () {
		should.throws(function () {
			var stream = contains('notfound');

			stream.write(new gutil.File({
				contents: new Buffer('this should be notfound')
			}));
		}, /contains "notfound"/);
	});

	it('should accept array of strings to find', function () {
		should.throws(function () {
			var stream = contains(['something', 'notfound', 'something else']);

			stream.write(new gutil.File({
				contents: new Buffer('this should be notfound')
			}));
		}, /contains "notfound"/);
	});

	it('should accept a regex to find', function () {
		should.throws(function () {
			var stream = contains({
				search: /([A-Z])\w+/g,
				regex: true
			});

			stream.write(new gutil.File({
				contents: new Buffer('this should be Found123!')
			}));
		}, /Found123/);
	});

	it('should allow you to pass onFound callback', function (done) {
		var stream = contains({
			search: 'found',
			onFound: function (str) {
				str.should.equal('found');
				done();
			}
		});

		stream.pipe(through.obj(function () {
			throw new Error('Stream continued! :(');
		}));

		stream.write(new gutil.File({
			contents: new Buffer('this should be found')
		}));
	});

	it('should allow you to pass onNotFound callback', function (done) {
		var stream = contains({
			search: 'notfound',
			onNotFound: function () {
				done();
			}
		});

		stream.pipe(through.obj(function () {
			throw new Error('Stream continued! :(');
		}));

		stream.write(new gutil.File({
			contents: new Buffer('this should not be found')
		}));
	});

	it('should continue the stream when told to (onFound callback)', function (done) {
		var stream = contains({
			search: 'found',
			onFound: function (str) {
				str.should.equal('found');
				return false;
			}
		});

		stream.pipe(through.obj(function () {
			done();
		}));

		stream.write(new gutil.File({
			contents: new Buffer('this should be found')
		}));
	});

	it('should continue the stream when told to (onNotFound callback)', function (done) {
		var stream = contains({
			search: 'notfound',
			onNotFound: function () {
				return false;
			}
		});

		stream.pipe(through.obj(function () {
			done();
		}));

		stream.write(new gutil.File({
			contents: new Buffer('this should not be found')
		}));
	});
});
