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
        debug('Handling request from ' + req.socket.remoteAddress);
        if(req.method != 'POST' || !req.body) {
            debug('No POST, next()');
            next();
            return;
        }

        if(typeof req.headers.referer === 'undefined') {
            next(new Error(errors['_NO_REFERER'] + '\n'));
            return;
        }
        var referer = URL.parse(req.headers.referer).host;
        
        if(req.body['protocol'] !== 'UJ/0.1') {
            debug('Invalid protocol string')
            next(new Error(errors['_PROTOCOL'] + '\n'));
            return;
        }

        try {
            var cmd = JSON.parse(req.body.cmd);
        } catch(e) {
            debug('Invalid JSON');
            next(new Error(errors['_INVALID_JSON'] + '\n'));
            return;
        }

        if(typeof cmd.method !== 'string') {
            debug('No method string given');
            next(new Error(errors['_NO_METHOD'] + '\n'));
            return;
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

        res.writeHead(200, {
            'content-type': 'text/plain'
            , 'access-control-allow-origin': '*'
            , 'access-control-allow-methods': 'GET, POST, OPTIONS'
            , 'access-control-allow-headers': 'Content-Type'
            , 'access-control-max-age': '86400'
        });

        debug('[hnd] switch');        
        try {
            switch(cmd.method) {
            case 'SET':
                debug('[hnd] SET');
                checkFields(cmd, ['chan', 'keyPath', 'value']);
                checkFields(req.body, ['WriteCaps', 'PubSign']);
                
                // TODO: WriteCaps
                /* php
                   if(!$this->checkWriteCaps($cmd['chan'],$POST['WriteCaps'])) {
                       throw new Exception('Channel password is incorrect.');
                   } */
                
                var cmd_json = JSON.stringify({ cmd: cmd
                                                , PubSign: req.body.PubSign
                                              });

                
                debug('[hnd] store.set');
                var storing = { cmd: cmd, PubSign: req.body.PubSign };

                store.set(cmd.chan
                          , referer
                          , cmd.keyPath
                          , JSON.stringify(storing)
                          , function(err){
                              if(err) { next(err); return; }
                              
                              debug('OK');
                              res.end('OK');
                          });
                break;
            case 'GET':
                checkFields(cmd, ['chan', 'keyPath']);

                debug('[hnd] GET: store.get', cmd.chan, referer, cmd.keyPath);
                store.get(cmd.chan
                          , referer
                          , cmd.keyPath
                          , function(err, value){
                              if(err) { next(err); return; }
                              
                              debug(value);
                              res.end(value);
                          });
                break;
            case 'SEND':
                checkFields(cmd, ['chan', 'keyPath', 'value']);
                
                var PubSig = req.body.PubSig;
                var json_res = JSON.stringify(
                    { cmd: cmd, 'PubSig': PubSig ? PubSig : null });
                store.send(cmd.chan
                           , referer
                           , cmd.keyPath
                           , json_res
                           , function(err){
                               if(err) { next(err); return; }
                               
                               res.end('OK\n');
                           });
                break;
            case 'RECEIVE':
                checkFields(cmd, ['chan', 'keyPath', 'value']);
                checkFields(req.body, ['WriteCaps']);

                // TODO: WriteCaps
                
                store.receive(cmd.chan
                              , referer
                              , cmd.keyPath
                              , cmd.delete
                              , function(err, messages){
                                  if(err) { callback(err); return; }
                                  
                                  res.end(JSON.stringify(messages));
                              });
                break;
            default:
                throw new Error('Invalid method');
            }
        } catch (e) {
            if(typeof e === 'string') {
                debug('[wrn] cought string in error handler expecting error obj');
            }
            next(e);
            return;
        }
    }
}

module.exports = Unhosted;
