stream-buffer-replace
=====================

Efficient streaming find and replace. Buffer based and boundary aware.

    npm install stream-buffer-replace


Advantages
----------

- never converts Buffers to strings
- only supports exact matching not patterns / regexs
- finds matches that span chunk boundaries
- finds matches that are bigger than a single chunk


Usage
-----

example using strings...

    var fs = require('fs');
    var replace = require('stream-buffer-replace');
    fs.writeFileSync('example.txt', "hello world");

    var stream = fs.createReadStream('example.txt');
    stream.pipe( replace('hello', 'goodbye') ).pipe(process.stdout);

    => goodbye world


example using buffers...

    var fs = require('fs');
    var replace = require('stream-buffer-replace');
    fs.writeFileSync('example.txt', "hello world");

    var stream = fs.createReadStream('example.txt');
    var replacer = replace(new buffer('hello'), new Buffer('goodbye'));
    stream.pipe( replacer ).pipe(process.stdout);

    => goodbye world


Tests
-----

Are written with Mocha and can be run with...

    npm install
    npm test

Contributions welcome.