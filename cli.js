#!/usr/bin/env node

var version  = '0.1.0'
  , connect  = require('connect')
  , Unhosted = require('./lib/unhosted')
  , args     = process.argv.slice(2)
  , usage    = 'Usage: unhosted [options]\n'
             + '  -h, --help         Output usage information.\n'
             + '  -H, --host ADDR    Host address, defaults to INADDR_ANY.\n'
             + '  -p, --port NUM     Port number, defaults to 8040.\n'
             + '  -s, --store ???    Select storage.\n'
             + '  -c, --config PATH  Load configuration file (json).\n'
  , port, host, store
  ;
  
while (args.length) {
  var arg = args.shift();
  switch (arg) {
    case '-h':
    case '--help':
      abort(usage);
      break;
    case '-v':
    case '--version':
      abort(version);
      break;
    case '-p':                   
    case '--port':
      args.length
        ? (port = args.shift())
        : abort('--port requires an argument');
      break;
    case '-H':
    case '--host':
      args.length
        ? (host = args.shift())
        : abort('--host requires an argument');        
      break;
    case '-s':
    case '--store':
      args.length
        ? (host = args.shift())
        : abort('--store requires an argument');        
      break;
    case '-c': // unhostedConfig.json
    case '--config':
      args.length
        ? (host = args.shift())
        : abort('--config requires an argument');        
      break;
    default:;
  }
}

(function createServer() {   
  port = port || 8030;
  host = host || '127.0.0.1';

  var app = module.exports = connect.createServer();  
  app.use(connect.bodyDecoder());
  app.use(Unhosted({store: store}));
  app.use(connect.errorHandler);
  app.listen(port);
  cb && cb();
}());

function errorHandler(err, req, res, next) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('ERROR: ' + err.message);
};

function abort() {
  console.error(str);
  process.exit(1);
};



