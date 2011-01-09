var fs = require('fs');
var URL = require('url');
var util = require('util');
var Step = require('step');

var debug = require('./debug');
var errors = require('./errors');
var nStoreStorageBackend = require('./storage').nStoreStorageBackend;

var Unhosted = function Unhosted(options){
    var store = options.store;

    // TODO: central try catch for all error messages
    return function UnhostedHandle(req, res, next){
        var headers = {
            'content-type': 'text/plain'
            , 'access-control-allow-origin': '*'
            , 'access-control-allow-methods': 'GET, POST, OPTIONS'
            , 'access-control-allow-headers': 'Content-Type'
            , 'access-control-max-age': '86400'
        }

        try {
            debug('Handling request from ' + req.socket.remoteAddress);
            if(req.method != 'POST' && req.method != 'HEAD' && !req.body) {
                debug('No POST or HEAD, next()');
                next();
                return;
            }

            if(typeof req.headers.referer === 'undefined') {
                throw new Error(errors['_NO_REFERER'] + '\n');
            }

            var referer = URL.parse(req.headers.referer).host;

            if(req.body['protocol'] !== 'UJ/0.2') {
                debug('Invalid protocol string')
                throw new Error(errors['_PROTOCOL'] + '\n');
            }

            try {
                var cmd = JSON.parse(req.body.cmd);
            } catch(e) {
                debug('Invalid JSON');
                throw new Error(errors['_INVALID_JSON'] + '\n');
            }

            if(typeof cmd.method !== 'string') {
                debug('No method string given');
                throw new Error(errors['_NO_METHOD'] + '\n');
            }

            var method = cmd.method;

            function checkFields(fields, check_fields) {
                var errorMessage = '';
                for(var i=0; i < check_fields.length ;i++) {
                    if(typeof fields[check_fields[i]] === 'undefined') {
                        errorMessage += 'Field "'+ check_fields[i] +'" missing.'

                        if(typeof errors[method][check_fields[i]] === 'string') {
                            errorMessage += ' ' + errors[method][check_fields[i]];
                        }

                        errorMessage +=  '\n';

                        debug('[hnd] throw:', errorMessage);
                        throw new Error(errorMessage);
                    }
                }
            }
        } catch(e) {
            next(e);
            return;
        }

        if(req.method == 'HEAD') {
            res.writeHead(200, headers);
            req.end();
            return;
        }

        debug('[hnd] switch');
        try {
            switch(cmd.method) {
            case 'SET':
                debug('[hnd] SET');
                checkFields(cmd, ['user', 'keyPath', 'value']);
                checkFields(req.body, ['password', 'sign']);

                // TODO: WriteCaps
                /* php
                   if(!$this->checkWriteCaps($cmd['chan'],$POST['WriteCaps'])) {
                       throw new Exception('Channel password is incorrect.');
                   } */

                var cmd_json = JSON.stringify({
                    cmd: cmd
                    , sign: req.body.sign
                });

                debug('[hnd] store.set');
                var storing = { cmd: cmd, sign: req.body.sign };

                store.set(cmd.user
                          , referer
                          , cmd.keyPath
                          , JSON.stringify(storing)
                          , function(err){
                              if(err) { next(err); return; }

                              debug('[hnd] OK');
                              res.end();
                          });
                break;
            case 'GET':
                checkFields(cmd, ['user', 'keyPath']);

                debug('[hnd] GET: store.get', cmd.user, referer, cmd.keyPath);
                store.get(cmd.user
                          , referer
                          , cmd.keyPath
                          , function(err, value){
                              if(err) { next(err); return; }

                              res.writeHead(200, headers);
                              res.end(value);
                          });
                break;
            case 'SEND':
                checkFields(cmd, ['user', 'keyPath', 'value']);

                var sign = req.body.sign;
                var json_res = JSON.stringify(
                    { cmd: cmd, 'sign': sign ? sign : null });
                store.send(cmd.user
                           , referer
                           , cmd.keyPath
                           , json_res
                           , function(err){
                               if(err) { next(err); return; }

                               res.writeHead(200, headers);
                               res.end();
                           });
                break;
            case 'RECEIVE':
                checkFields(cmd, ['user', 'keyPath', 'value']);
                checkFields(req.body, ['password']);

                // TODO: WriteCaps

                store.receive(cmd.user
                              , referer
                              , cmd.keyPath
                              , cmd.delete
                              , function(err, messages){
                                  if(err) { next(err); return; }

                                  res.end(JSON.stringify(messages));
                              });
                break;
            default:
                throw new Error('Invalid method');
            } // switch(method)
        } catch (e) {
            if(typeof e === 'string') {
                debug('[wrn] cought string in error handler expecting error obj');
            }
            next(e);
        }
    }
}

module.exports = Unhosted;
