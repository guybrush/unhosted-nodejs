var connect = require('connect')
  , Unhosted = require('./lib/unhosted')
  , store = new nStoreStorageBackend()
  , app = module.exports = connect.createServer()
  ;

if (!store.initialized) {
  store.init({}, function(){console.log('init db')});
} else {
  process.nextTick(function(){
    callback(null);
  });
}
  
app.use(connect.bodyDecoder());
app.use(Unhosted({store:store}));
app.use(connect.errorHandler());

// app.listen(port, host);
//   or: 
// $ spark -p port -H host -n worker -ssl ....
