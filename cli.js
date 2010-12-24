var createServer = require('./app').createServer;

// TODO: cmd options: address, port etc.
var app = createServer();
app.listen(8030);

console.log('Unhosted listening on port 8030');
