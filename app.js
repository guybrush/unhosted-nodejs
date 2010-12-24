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
    
    var indexRouter = connect.router(function(app){
        // Index page
        app.get('/', function(req, res, next){
            res.writeHead({ 'content-type': 'text/html' });
            res.end('<a href="/genkey/genkey.html">Generate Key</a>'
                    + '<br /><a href="/examples/wappblog/bootloader.html">Blog</a>'
                    + '<br /><a href="/examples/wappbook/bootloader.html">Book</a>'
                    + '<br /><a href="/examples/wappmail/bootloader.html">Mail</a>');
        });
    });
    
    // Setup middleware stack
    app.use(staticProvider(path.normalize(process.cwd() + '/../../wappside/')));
    app.use(indexRouter);
    app.use(bodyDecoder());
    app.use(Unhosted({store: store}));
    app.use(errorHandler);
    
    return app;
}

exports.createServer = createServer;