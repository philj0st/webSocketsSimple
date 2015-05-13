
$( "div" ).mousemove(function( event ) {
  var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
  var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
  $( "span:first" ).text( "( event.pageX, event.pageY ) : " + pageCoords );
  $( "span:last" ).text( "( event.clientX, event.clientY ) : " + clientCoords );
  

  console.log(event);
  var msg = {
		type: 'updatePos',
		data: [event.pageX, event.pageY],
		date: Date.now()
	}
	connection.send(JSON.stringify(msg));
});

//globals
var socketServerURL = "ws://localhost:8080";
var connection = new WebSocket(socketServerURL);

var msg = {
	type: 'join',
	data: 'user' + Math.floor(Math.random()*(101-1)),
	date: Date.now()
};

connection.onopen = function () {
	//sending a join msg after establishing a connection
	connection.send(JSON.stringify(msg));
};

connection.onmessage = function (message) {
	console.log(message);
}

connection.onerror = function (err) {
	console.log(err);
}