/*
 * HTTP Response assertion helper
 */
var assert = require('assert');
assert.unhosted = require('./assert-unhosted');

var errors = require('./errors')
var UnhostedApp = require('../app');


function extend(destination,source) {
    for (var prop in source){
        if(source.hasOwnProperty(prop)){
            destination[prop] = source[prop];
        }
    }
    return destination;
}

var assert_unhosted = function(method, options){
    var beforeExit = options.beforeExit;
    var referer = options.referer || null;
    var protocol = options.protocol || null;
    var data = options.data || '';
    var cmd = options.cmd || null;
    var headers = options.headers || {};
    
    
    var response = options.response || { body: /OK/};
    

    var request = {
        url: '/'
        , timeout: 1000
        , method: 'POST'
        , headers: {}
    };

    // Construct requeset
    if(referer) { request.headers.referer = referer; }
    if(typeof headers['content-type'] === 'undefined') {
        request.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    if(headers) { extend(request.headers, headers); }

    // Construct request data
    if(data.length > 0 && data.indexOf('&') !== data.length - 1) {
        data += '&';
    }
    if(protocol) {
        data += 'protocol=' + protocol;
    }
    if(cmd) {
        if(typeof cmd === 'object') {
            cmd.method = cmd.method || method;
            data += '&cmd=' + JSON.stringify(cmd);
        } else {
            data += '&cmd=' + cmd;
        }
    }
    
    request.data = data;
    
    var gotRes = false;
    var app =  UnhostedApp.createServer({}, function(){
        assert.response(app, request
                        , response
                        , function(res){
                            gotRes = true;
                        });
    });
    
    beforeExit(function(){
        assert.equal(true, gotRes, 'Unhosted request not successful');
    });
}

module.exports = assert_unhosted;;