PirateParser
====================

  parse torrents_mini.csv.gz

  [![Build Status][travis-image]][travis-url]

Install
-------
stable
```bash
npm install -g pirate-parser
```
edge
```bash
npm install -g https://github.com/daxxog/pirate-parser/tarball/master
```

Usage
-------

```js
var PirateParser = require('./pirate-parser.js'),
    pirate = new PirateParser('./torrents_mini.csv.gz');

pirate.on('torrent', function(torrent) {
	console.log(torrent[0]); //list torrent names
});

pirate.on('end', function() {
	console.log('EOF');
})
```
cli
```bash
pirate-parser torrents_mini.csv.gz
```

[travis-image]: https://img.shields.io/travis/daxxog/pirate-parser.png?branch=master
[travis-url]: https://travis-ci.org/daxxog/pirate-parser