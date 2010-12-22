var assert = require('assert');
assert.unhosted = require('../lib/assert-unhosted');

var errors = require('../lib/errors')
var UnhostedApp = require('app');
var Unhosted = require('unhosted');

function setupUnhostedServer(cb){
    return UnhostedApp.createServer({}, cb);
}

var protocol = 'protocol=UJ/0.1';

var testData = { that: 'is mah data'};
var testKeyPath = '/some/key/in/here';
var testPubSign = 'BADF00D';

var genericCmd = {
    chan: 'test'
    , keyPath: testKeyPath
    , value: testData
}

var invalidCmd = 'Some%20invalid%20json%2C%20Z%3D%22%C2%A7Q%2FZ%25%3D';


module.exports = {
    'test Unhosted#SET': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: 'http://example.com/'
            , protocol: 'UJ/0.1'
            , data: 'WriteCaps=asdf&PubSign=BADF00D'
            , cmd: genericCmd
        });
    }

    , 'test Unhosted#SET NO_REFERER': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , response: {
                body: 'ERROR: ' + errors['_NO_REFERER'] + '\n'
            }
        });
    }

    , 'test Unhosted#SET missing protocol': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: 'http://example.com'
            , cmd: genericCmd
            , response: {
                body: 'ERROR: ' + errors['_PROTOCOL'] + '\n'
            }
        });
    }

    , 'test Unhosted#SET INVALID_JSON': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: 'http://example.com'
            , protocol: 'UJ/0.1'
            , cmd: invalidCmd
            , response: {
                body: 'ERROR: ' + errors['_INVALID_JSON'] + '\n'
            }
        });
    }

    , 'test Unhosted#SET missing chan': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: 'http://example.com'
            , protocol: 'UJ/0.1'
            , cmd: {
                keyPath: testKeyPath
                , value: testData
            }
            , response: {
                body: 'ERROR: Field "chan" missing. ' + errors['SET']['chan'] + '\n'
            }
        });
    }

    , 'test Unhosted#SET missing keyPath': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: 'http://example.com'
            , protocol: 'UJ/0.1'
            , cmd: {
                chan: 'test'
                , value: testData
            }
            , response: {
                body: 'ERROR: Field "keyPath" missing. ' + errors['SET']['keyPath'] + '\n'
            }
        });
    }

    , 'test Unhosted#SET missing value': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: 'http://example.com'
            , protocol: 'UJ/0.1'
            , cmd: {
                chan: 'test'
                , keyPath: testKeyPath
            }
            , response: {
                body: 'ERROR: Field "value" missing. ' + errors['SET']['value'] + '\n'
            }
        });
    }
}