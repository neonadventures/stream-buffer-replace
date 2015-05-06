var util = require('util');
var stream = require('stream');
var bindexOf = require('buffer-indexof');

util.inherits(ReplaceStream, stream.Transform);

function ReplaceStream(matcher, replacement, options) {
  this.matcher = new Buffer(matcher);
  this.replacement = new Buffer(replacement);
  this.chunks = [];
  stream.Transform.call(this, options);
}

ReplaceStream.prototype._transform = function(chunk, encoding, done) {
  this.chunks.push(chunk);
  var segment = Buffer.concat(this.chunks)
  remainder = this.pushWithReplacements(segment);
  this.chunks = [remainder];
  done();
}

ReplaceStream.prototype._flush = function(done) {
  if(this.chunks.length > 0) {
    this.push(Buffer.concat(this.chunks));
    this.chunks = [];
    done();
  }
}

ReplaceStream.prototype.pushWithReplacements = function(src, done) {
  var f = function(i) {
    var start = bindexOf(src, this.matcher, i);
    if(start === -1) {
      return src.slice(i);
    }
    var parts = [];
    parts.push(src.slice(i, start));
    parts.push(this.replacement);
    this.push(Buffer.concat(parts));
    return f(start + this.matcher.length);
  }.bind(this);
  return f(0);
}

module.exports = function(matcher, replacement, options) {
  return new ReplaceStream(matcher, replacement, options);
}