/* PirateParser / make.js
 * echo 'make script for PirateParser' && node make
 * (c) 2014 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

var bitfactory = require('bitfactory'),
    UglifyJS = require("uglify-js"),
    stoptime = require('stoptime'),
    fstream = require('fstream'),
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
            var read = fstream.Reader('torrents_test.csv'),
                write = fstream.Writer('torrents_test.csv.gz'),
                gz = spawn('gzip');

            read.pipe(gz.stdin);
            gz.stdout.pipe(write);

            gz.on('close', function() {
                cb();
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