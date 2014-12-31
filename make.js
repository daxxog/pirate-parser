/* PirateParser / make.js
 * echo 'make script for PirateParser' && node make
 * (c) 2014 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

var bitfactory = require('bitfactory'),
    UglifyJS = require("uglify-js"),
    stoptime = require('stoptime'),
    spawn = require('child_process').spawn,
    fs = require('fs');

var watch = stoptime(),
    header = '';

bitfactory.make({ //routes
    "": function(err, results) {
        console.log('built PirateParser in ' + watch.elapsed() + 'ms.');
    }
}, { //dependencies
    "*": { //wildcard
        "header": function(cb) {
            fs.readFile('pirate-parser.h', 'utf8', function(err, data) {
                header = data;
                cb(err);
            });
        },
        "torrents_test.csv.gz": function(cb) {
            var gz = spawn('gzip', ['-k', 'torrents_test.csv']);

            gz.on('close', cb);
            gz.on('error', function() {
                console.error('error', arguments);
            });
        },
        "pirate-parser.min.js": ["header", function(cb) {
            fs.writeFileSync('pirate-parser.min.js', header + UglifyJS.minify('pirate-parser.js').code);
            cb();
        }],
        "cli.min.js": ["header", function(cb) {
            fs.writeFileSync('cli.min.js', header + UglifyJS.minify('cli.js').code);
            cb();
        }]
    }
});