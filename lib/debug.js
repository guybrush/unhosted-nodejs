var util = require('util');

var DEBUG = process.env['DEBUG'] || false;
var debug = exports.debug = function debug(){
    if(DEBUG) {
        util.print('[dbg] ');
        console.log.apply(console.log, arguments);
    }
}

module.exports = debug;