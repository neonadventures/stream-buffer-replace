var util = require('util');
var stream = require('stream');
var bindexOf = require('buffer-indexof');

util.inherits(ReplaceStream, stream.Transform);

function ReplaceStream(matcher, replacement, options) {
  this.matcher = new Buffer(matcher);
  this.replacement = new Buffer(replacement);
  this.lengthDiff = this.replacement.length - this.matcher.length;
  // this.minChunkSize = this.matcher.length * 2;
  // this.chunks = [];
  stream.Transform.call(this, options);
}

ReplaceStream.prototype._transform = function(chunk, encoding, done) {
  var f = function(i) {
    var start = bindexOf(chunk, this.matcher, i);
    if(start === -1) {
      this.push(chunk.slice(i));
      done();
      return
    }
    var parts = [];
    parts.push(chunk.slice(i, start));
    parts.push(this.replacement);
    this.push(Buffer.concat(parts));
    f(start + this.matcher.length);
  }.bind(this);
  f(0);
}

module.exports = function(matcher, replacement, options) {
  return new ReplaceStream(matcher, replacement, options);
}