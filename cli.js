/* PirateParser / cli.js
 * command line interface for PirateParser
 * (c) 2014 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

var PirateParser = require('./pirate-parser.js'),
	pirate = new PirateParser(process.argv[2]);

pirate.on('torrent', function(torrent) {
	console.log(JSON.stringify(torrent));
});