#!/usr/bin/env node

var app        = require('./app.js')
  , args       = process.argv.slice(2)
  , port       = 8040
  , host       = 'localhost'
  , store      = null
  , staticPath = null
  , version    = '0.1.0'
  , usage      = 'unhosted-nodejs ('+version+')\n\n'
               + 'Usage: unhosted [options]\n\n'
               + 'Options:\n'
               + '  -v, --version      Output version.\n'
               + '  -h, --help         Output usage information.\n'
               + '  -H, --host ADDR    Host address, defaults to "localhost".\n' 
               + '  -p, --port NUM     Port number, defaults to 8040.\n'
               + '  -S, --static PATH  Serve static files.\n'
          //   + '  -s, --store DSN    Data Source Name - e.g.: \n'
          //   + '                       mysql://user:pwd@unix/path/to/socket\n'
          //   + '                       nstore:////full/unix/path/to/file.db\n'
          //   + '                       sqlite:////full/unix/path/to/file.db\n'
          //   + '                       redis:////full/unix/path/to/file.db\n'
          //   + '  -c, --config PATH  Load configuration file (json).\n'
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
                ? (store = args.shift())
                : abort('--store requires an argument');        
            break;
        case '-S':
        case '--static':
            args.length
                ? (staticPath = args.shift())
                : abort('--static requires an argument');        
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



