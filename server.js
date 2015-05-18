#!/usr/bin/env node

//dependencies
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server
});

//globals
var userlist = [];
var client = [];

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true;
}

function toAllClients(msg){
	for (var i = 0; i < client.length; i++) {
		client[i].sendUTF(JSON.stringify(msg));
	};
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin 
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('', request.origin);
    client.push(connection);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
    	var msg = JSON.parse(message.utf8Data);

    	switch(msg.type){
    		case 'join':
    			userlist[client.indexOf(connection)] = msg.data;
    			var msg = {type:'updateUserlist', data:userlist, date:Date.now()};
    			toAllClients(msg);
    			console.log(msg.data + 'joined');
    		break;

    		case 'message':
    			var msg = {type:'updateMessage', data:msg.data, date:Date.now()};
    			toAllClients(msg);
    			console.log('message forwarded: ' + msg.data);
    			break;

    		case 'updatePos':
    			console.log('client' + client.indexOf(connection) + ' position update: [x:' + msg.data[0] 
    			+ '/y:' + msg.data[1] + ']');
    	}
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});