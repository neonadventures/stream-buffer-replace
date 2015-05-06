var assert = require("assert");
var streamBuffers = require("stream-buffers");
var replace = require('../index');

describe('replace', function() {
  it('replaces a string', function(done) {
    var input = new streamBuffers.ReadableStreamBuffer();
    var output = new streamBuffers.WritableStreamBuffer();
    input
      .pipe(replace('ipsum', 'REPLACED'))
      .pipe(output)
      .on('close', function() {
        assert.equal(output.getContentsAsString("utf8"), 'Lorem REPLACED dolor sit amet');
        done();
      });
    input.put('Lorem ipsum dolor sit amet');
    input.destroySoon();
  });

  it('replaces a string multiple times', function(done) {
    var input = new streamBuffers.ReadableStreamBuffer();
    var output = new streamBuffers.WritableStreamBuffer();
    input
      .pipe(replace('ipsum', 'REPLACED'))
      .pipe(output)
      .on('close', function() {
        assert.equal(output.getContentsAsString("utf8"), 'Lorem REPLACED dolor REPLACED sit amet');
        done();
      });
    input.put('Lorem ipsum dolor ipsum sit amet');
    input.destroySoon();
  });

  it('replaces a string on a chunk boundary', function(done) {
    var input = new streamBuffers.ReadableStreamBuffer({chunkSize: 7});
    var output = new streamBuffers.WritableStreamBuffer();
    input
      .pipe(replace('ipsum', 'REPLACED'))
      .pipe(output)
      .on('close', function() {
        assert.equal(output.getContentsAsString("utf8"), 'Lorem REPLACED dolor REPLACED sit REPLACED');
        done();
      });
    input.put('Lorem ipsum dolor ipsum sit ipsum');
    input.destroySoon();
  });

  it('replaces a string when replacement is longer than a single chunk', function(done) {
    var input = new streamBuffers.ReadableStreamBuffer({chunkSize: 3});
    var output = new streamBuffers.WritableStreamBuffer();
    input
      .pipe(replace('andy', 'nick'))
      .pipe(output)
      .on('close', function() {
        assert.equal(output.getContentsAsString("utf8"), 'hello nick hello nick hello nick');
        done();
      });
    input.put('hello andy hello andy hello andy');
    input.destroySoon();
  });
});