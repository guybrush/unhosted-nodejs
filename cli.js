#!/usr/bin/env node

var Unhosted   = require('./lib/unhosted')
  , fs         = require('fs')
  , connect    = require('connect')
  , request    = require('request')
  , app        = module.exports = connect.createServer()
  , cwd        = process.cwd()
  , args       = process.argv.slice(2)
  , port       = 8040
  , host       = 'localhost' // ADDR
  , store      = null        // 'nstore:./path/to/store.db'
  , staticPath = null        // relative path to directory
  , clientPath = null        //
  , clientSource = ''
  , tokens     = null        // {r:"7db31",w:"02:49e"}
  , client     = null        // {api:require(client),path:"/unhosted.js"}
  , config     = null
  , version    = '0.1.0'
  , usage      = 'unhosted-nodejs ('+version+')\n\n'
               + 'Usage: unhosted [options]\n\n'
               + 'Options:\n'
               + '  -v, --version       Output version.\n'
               + '  -h, --help          Output usage information.\n'
               + '  -H, --host ADDR     Host address, defaults to "localhost".\n' 
               + '  -p, --port NUM      Port number, defaults to 8040.\n'
               + '  -S, --static PATH   Serve static files in the directory.\n'
               + '                      (e.g.: ./webapp/xy)'
               + '  -g, --genkey R W    Generate keys where R and W are the\n'
               + '                      read- and write-tokens.\n'
               + '  -c, --client ROUTE  Serve client-side implementation of\n'
               + '                      unhosted on route ROUTE (e.g.: /unhosted.js").\n' 
          //   + '  -s, --store DSN    Data Source Name - e.g.: \n'
          //   + '                       memory (default)
          //   + '                       nstore:./path/to/file.db\n'
          //   + '                       supermarket:./path/to/file.db\n'
          //   + '                       redis:./path/to/file.db\n'
          //   + '  -C, --config PATH  Load configuration file (json).\n'
  ;

console.log(cwd)
  
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
                ? (staticPath = cwd+'/'+args.shift())
                : abort('--static requires an argument');        
            break;
        case '-g':
        case '--genkeys':
            (args.length > 1)
                ? (tokens = {"r":args.shift(),"w":args.shift()})
                : abort('--genkeys requires 2 arguments');        
            break;
        case '-C': // unhostedConfig.json
        case '--config':
            args.length
                ? (config = args.shift())
                : abort('--config requires an argument');        
            break;
          case '-c':
        case '--client':
            (args.length > 1)
                ? (clientVersion = args.shift() && clientPath = args.shift())
                : abort('--client requires 2 arguments');        
            break;
        default:break;
    }
}

store = new nStoreStorageBackend()
if (!store.initialized) {
  store.init({}, function(){});
} else {
  process.nextTick(function(){
    callback(null);
  });
}
  
app.use(connect.bodyDecoder());
app.use(Unhosted({store:store}));
app.use(connect.errorHandler());

staticPath && app.use(connect.staticProvider(staticPath));
clientPath 
app.listen(port, host);
console.log('unhosted running on '+host+':'+port);
staticPath && console.log('serving static files from '+staticPath+'\n');
tokens && tokens.r && tokens.w && genKeys(tokens, function(err, keys){
    console.log(keys);
});

function genKeys(tokens, cb) {
  var filePrefix = 'https://github.com/DanielG/unhosted/raw/feature-refactor/wappside/'
    , cloud = (port) ? host+':'+port : host
  loadModule( { files : [ filePrefix+'unhosted/jsbn.js'
                        , filePrefix+'unhosted/prng4.js'
                        , filePrefix+'unhosted/rijndael.js'
                        , filePrefix+'unhosted/rng.js'
                        , filePrefix+'unhosted/sha1.js' 
                        , filePrefix+'unhosted/unhosted.js'
                        , filePrefix+'genkey/genkey.js' ]
              , dest  : process.cwd()+'/unhosted.js'
              }
            , function(err, source, module) {
                  if (err) console.log(err)
                  else console.log(module.createPub('generatedPub',cloud,tokens))
              })
};

function abort(str) {
  console.error(str);
  process.exit(1);
};

// loadModule( { files : [ 'http://example.org/file.js'
//                       , 'relative/path/to/file.js' 
//                       , '/absolute/path/to/file.js'
//                       ]
//             , dest  : 'path/to/destination.js'
//             }
//           , function(err, source, module){}
//           ) 
function loadModule(opt, cb) {
  var self = this
  loadSource(opt.files, function(err, source) {
    writeModule(source, opt.dest, function(err, source, module) {
      cb(err, source, module)
    })
  })
}

function loadSource(files, cb) {  
  // #TODO check if there is /^http[s?]:\/\// - if not use fs.readFile 
  var file = files.shift()
  if (file) {
    console.log('requetsing uri: '+file)
    request({uri:file}, function(err, res, body) {
      clientSource += body
      loadSource(files, cb) 
    })
  } else { 
    cb(null, clientSource)
  }
}

function writeModule(source, dest, cb) {
  source = '(function(exports){'
         + 'var navigator={}; navigator.appName="";'         
         + source + '\n'
         + 'exports.createPub = createPub;'
         + '})(exports)'
  fs.writeFile(dest, source, function(err) {
    cb(err, source, require(dest))
  })
}


