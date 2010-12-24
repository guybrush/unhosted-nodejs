var path = require('path');
var connect = require('connect');
var errorHandler = require('connect/middleware/errorHandler');
var bodyDecoder = require('connect/middleware/bodyDecoder');
var staticProvider = require('connect/middleware/staticProvider');

var Unhosted = require('./lib/unhosted');

var errorHandler = function errorHandler(err, req, res, next){
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('ERROR: ' + err.message);
};

var createServer = function(options, callback){    
    options = options || {};

    var app = module.exports = connect.createServer();
    var store = options.db || new nStoreStorageBackend();

    if(!store.initialized) {
        store.init(options.dbOptions || {}, callback);
    } else {
        process.nextTick(function(){
            callback(null);
        });
    }

    // Setup middleware stack
    app.use(bodyDecoder());
    app.use(Unhosted({store: store}));
    app.use(errorHandler);
    
    return app;
}

exports.createServer = createServer;