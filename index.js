var util = require('util');
var stream = require('stream');
var bindexOf = require('buffer-indexof');

util.inherits(ReplaceStream, stream.Transform);

function ReplaceStream(matcher, replacement, options) {
  this.matcher = new Buffer(matcher);
  this.replacement = new Buffer(replacement);
  this.chunksLength = 0;
  this.chunks = [];
  stream.Transform.call(this, options);
}

ReplaceStream.prototype._transform = function(chunk, encoding, done) {
  this.chunks.push(chunk);
  this.chunksLength += chunk.length;
  var segment = Buffer.concat(this.chunks, this.chunksLength);
  remainder = this.pushWithReplacements(segment);
  this.chunks = [remainder];
  this.chunksLength = remainder.length;
  done();
}

ReplaceStream.prototype._flush = function(done) {
  if(this.chunks.length > 0) {
    this.push(Buffer.concat(this.chunks, this.chunksLength));
    this.chunks = [];
    this.chunksLength = 0;
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