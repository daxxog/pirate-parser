/* PirateParser / test / basic.js
 * basic test
 * (c) 2014 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

var vows = require('vows'),
    assert = require('assert'),
    PirateParser = require('../pirate-parser.min.js');

vows.describe('basic').addBatch({
    'PirateParser': {
        topic: function() {
        	return PirateParser;
        },
        'is a function': function(topic) {
            assert.equal(typeof topic, 'function');
        }
    },
    'PirateParser.isParsed': {
        topic: function() {
        	return PirateParser.isParsed;
        },
        'is a function': function(isParsed) {
            assert.strictEqual(typeof isParsed, 'function');
        },
        'finds an Array with a length of 7': function(isParsed) {
            assert.strictEqual(isParsed(['', '', '', '', '', '', '']), true);
        },
        'fails for Array with different length': function(isParsed) {
            assert.strictEqual(isParsed([1,2,3,4,5]), false);
        },
        'fails for empty Object': function(isParsed) {
        	assert.strictEqual(isParsed({}), false);
        },
        'fails for empty Array': function(isParsed) {
        	assert.strictEqual(isParsed([]), false);
        },
        'fails for Boolean': function(isParsed) {
        	assert.strictEqual(isParsed(false), false);
        }
    },
    'torrent event': {
        topic: function() {
        	var pp = new PirateParser('./torrents_test.csv.gz'),
        		that = this;

        	pp.on('torrent', function(torrent) {
        		that.callback(null, torrent);
        	});
        },
        'returns a parsed object': function(torrent) {
        	assert.strictEqual(PirateParser.isParsed(torrent), true);
        }
    },
    'end event': {
        topic: function() {
        	var pp = new PirateParser('./torrents_test.csv.gz'),
        		that = this;

        	pp.on('end', function() {
        		that.callback(null, true);
        	});
        },
        'gets emitted': function(didEmit) {
        	assert.strictEqual(didEmit, true);
        }
    },
    'new PirateParser(\'./torrents_test.csv.gz\')': {
        topic: function() {
        	return new PirateParser('./torrents_test.csv.gz');
        },
        'returns an object instance': function(pirate) {
        	assert.strictEqual(typeof pirate, 'object');
        },
        'can .sanitize SEP_FIX': function(pirate) {
        	assert.strictEqual(pirate.sanitize('hello\\\"|'), 'hello' + pirate.SEP_FIX);
        },
        'can .sanitize ESCAPE_FIX': function(pirate) {
        	assert.strictEqual(pirate.sanitize('hello\\\"'), 'hello' + pirate.ESCAPE_FIX);
        },
        '._finder finds |': function(topic) {
        	assert.strictEqual(topic._finder('|'), true);
        },
        '._finder finds "': function(topic) {
        	assert.strictEqual(topic._finder('"'), true);
        },
        '._finder doesnt find other stuff': function(topic) {
        	assert.strictEqual(topic._finder('other stuff'), false);
        }
    }
}).export(module);