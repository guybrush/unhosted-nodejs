#!/usr/bin/env node

var app      = require('./app.js')
  , args     = process.argv.slice(2)
  , version  = '0.1.0'
  , usage    = 'unhosted-nodejs ('+version+')\n\n'
             + 'Usage: unhosted [options]\n\n'
             + 'Options:\n'
             + '  -h, --help         Output usage information.\n'
             + '  -H, --host ADDR    Host address, defaults to INADDR_ANY.\n'
             + '  -p, --port NUM     Port number, defaults to 8040.\n'
          // + '  -s, --store ???    Select storage.\n'
          // + '  -c, --config PATH  Load configuration file (json).\n'
  , port, host, store
  ;

if (!args.length) abort(usage);
  
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
    default:break;
  }
}

app.listen(port, host);
console.log('unhosted running on '+host+':'+port);

function abort(str) {
  console.error(str);
  process.exit(1);
};



