var express = require('express')
  , routes = require('./routes');

var handler = require('./handler');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

io.set('transports', [
  'websocket'
, 'flashsocket'
, 'htmlfile'
, 'xhr-polling'
, 'jsonp-polling'
]);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

io.sockets.on('connection', function(socket) {
  socket.json.send({'sender':'server','type':'text','text': '<span class="systemMessage">Соединение с сервером установленно.</span>'});

  socket.on('message', function(msg) {
    handler.parser(socket, msg, function(res) {
      socket.json.send(res);
    });
  });

  socket.on('disconnect', function() {
    io.sockets.json.send({'1':'2'});
  });

});

app.listen(3030, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
