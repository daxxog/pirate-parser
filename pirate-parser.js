/* PirateParser
 * parse torrents_mini.csv.gz
 * (c) 2014 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

/* UMD LOADER: https://github.com/umdjs/umd/blob/master/returnExports.js */
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.PirateParser = factory();
  }
}(this, function() {
    var fstream = require('fstream'),
        spawn = require('child_process').spawn,
        inherits = require('util').inherits,
        EventEmitter = require('events').EventEmitter,
        read = require('fs').readFileSync,
        sf = require('switch-factory'),
        S = require('string'),
        PirateParser;

    PirateParser = function(_f) {
        var that = this,
            f;

        if(typeof _f !== 'string') {
            f = 'torrents_mini.csv.gz';
        } else {
            f = _f;
        }

        this.bin = [];
        this.headers = [];

        this.fs = fstream.Reader(f);
        this.gz = spawn('gzip', ['-dc']);

        this.fs.pipe(this.gz.stdin);

        this.gz.stdout.on('data', function(d) {
            var s = d.toString(),
                a = s.toString().split('\n'),
                parsed;

            a.forEach(function(v) {
                parsed = that.parse(v);

                if(PirateParser.isParsed(parsed)) {
                    that.emit('torrent', parsed);
                } else if(parsed !== -1) {
                    that.bin.push(v);
                }
            });

            if(that.bin.length > 10) { //merge needed
                that.merge();
            }
        });

        this.gz.on('close', function() {
            while(that.bin.length > 1) { //clean up and merge
                that.merge();
            }

            that.emit('end');
        });
    }; inherits(PirateParser, EventEmitter);

    PirateParser.prototype.merge = function() {
        var merge = [];

        merge.push(this.bin.shift());
        merge.push(this.bin.shift());
        
        parsed = this.parse(merge.join(''));

        while(!PirateParser.isParsed(parsed)) {
            merge.push(this.bin.shift());

            if(this.bin.length === 0) {
                throw 'parse error\n\n' + merge.join('') + '\n\n' + JSON.stringify(merge);
            } else {
                parsed = this.parse(merge.join(''));
            }
        }

        this.emit('torrent', parsed);
    };

    PirateParser.prototype.parse = function(_part) {
        var that = this,
            open = {'|': false, '"': false},
            bin = false,
            part = _part,
            parsed;

        if(part.indexOf('"') !== 0) {
            if(this.headers.length === 1) {
                part = this.headers.shift() + part;
            }

            if(part.indexOf('|') === -1) {
                this.headers.push(part);
                bin = -1;
            }
        }

        if(bin === false) {
            parsed = this.sanitize(part).split('').map(function(v, i) {
                if(that._finder(v)) {
                    open[v] = !open[v]; //flip flop
                }

                switch(v) {
                    case '|':
                        return (open['"'] === true) ? that.CHAR_FIX : v;
                    case that.CHAR_FIX:
                        throw 'CHAR_FIX error\n\n' + part;
                    default:
                        return v;
                }
            }).join('').split('|').map(function(v) {
                if(open['"'] === true) {
                    bin = true;
                }

                return v.split('').map(function(v) {
                    if(that._finder(v)) {
                        open[v] = !open[v]; //flip flop
                    }

                    switch(v) {
                        case that.CHAR_FIX:
                            return (open['"'] === true) ? '|' : v;
                        case that.ESCAPE_FIX:
                            return (open['"'] === true) ? '""' : v;
                        default:
                            return v;
                    }
                }).join('');

                return v;
            });
        }

        return bin ? bin : parsed;
    };

    PirateParser.prototype.sanitize = function(part) {
        return S(part)
                      .replaceAll('\\\"|', this.SEP_FIX)
                      .replaceAll('\\\"' , this.ESCAPE_FIX).s;
    };

    PirateParser.isParsed = function(part) {
        return ((Array.isArray(part)) && (part.length === 7));
    };

    PirateParser.prototype._finder = sf.is(['|', '"']);
    PirateParser.prototype.CHAR_FIX = '\v';
    PirateParser.prototype.ESCAPE_FIX = '\f';
    PirateParser.prototype.SEP_FIX = PirateParser.prototype.ESCAPE_FIX + '"|';

    return PirateParser;
}));
