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
        topic: PirateParser,
        'is undefined': function(topic) {
            assert.equal(topic, undefined);
        },
    }
}).export(module);