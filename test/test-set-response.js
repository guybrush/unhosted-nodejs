var data = require('./fixtures/test-data');
var assert = require('assert');
var errors = require('../lib/errors')
var assert_unhosted = require('./lib/assert-unhosted');

assert.unhosted = assert_unhosted;

var genericCmd = {
    chan: data.chan
    , keyPath: data.keyPath
    , value: data.someData
}

var authData = 'WriteCaps='+ data.writeCaps +'&PubSign=' + data.pubSign;
var referer = 'http://example.com/'

module.exports = {
    'test Unhosted#SET': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: referer
            , protocol: data.protocol
            , data: authData
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
            , referer: refrerer
            , cmd: genericCmd
            , response: {
                body: 'ERROR: ' + errors['_PROTOCOL'] + '\n'
            }
        });
    }

    , 'test Unhosted#SET INVALID_JSON': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: referer
            , protocol: data.protocol
            , cmd: data.invalidJson
            , response: {
                body: 'ERROR: ' + errors['_INVALID_JSON'] + '\n'
            }
        });
    }

    , 'test Unhosted#SET missing chan': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: referer
            , protocol: data.protocol
            , cmd: {
                keyPath: data.keyPath
                , value: data.someData
            }
            , response: {
                body: 'ERROR: Field "chan" missing. ' + errors['SET']['chan'] + '\n'
            }
        });
    }

    , 'test Unhosted#SET missing keyPath': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: referer
            , protocol: data.protocol
            , cmd: {
                chan: data.chan
                , value: data.someData
            }
            , response: {
                body: 'ERROR: Field "keyPath" missing. ' + errors['SET']['keyPath'] + '\n'
            }
        });
    }

    , 'test Unhosted#SET missing value': function(beforeExit){
        assert.unhosted('SET', {
            beforeExit: beforeExit
            , referer: referer
            , protocol: data.protocol
            , cmd: {
                chan: data.chan
                , keyPath: data.keyPath
            }
            , response: {
                body: 'ERROR: Field "value" missing. ' + errors['SET']['value'] + '\n'
            }
        });
    }
}