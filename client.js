
$( "div" ).mousemove(function( event ) {
  var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
  var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
  $( "span:first" ).text( "( event.pageX, event.pageY ) : " + pageCoords );
  $( "span:last" ).text( "( event.clientX, event.clientY ) : " + clientCoords );
  
  //send mouse position to server
  var msg = {
		type: 'updatePos',
		data: [event.pageX, event.pageY],
		date: Date.now()
	}
	if (connection.readyState === connection.OPEN) {
		connection.send(JSON.stringify(msg));
	};
});

//globals
var socketServerURL = "ws://localhost:8080";
var connection = new WebSocket(socketServerURL);

connection.onopen = function () {
	
	var msg = {
	type: 'join',
	data: 'username' + Math.floor(Math.random()*(101-1)),
	date: Date.now()
	};

	//sending a join msg after establishing a connection
	connection.send(JSON.stringify(msg));
};

connection.onmessage = function (message) {
	var msg = JSON.parse(message.data);

    switch(msg.type){

    	case 'message':
    		console.log("message received");

    	break;

    	case 'updateUserlist':
    		console.log('new userlist:' + msg.data);
    		var userlist = msg.data;

    		//populate userlist
    		$('#userlist').html("");
    		for (var i = 0; i < userlist.length; i++) {
    			$('#userlist').append('<li>'+userlist[i]+'</li>');
    		};

    		addNewUserImgs(userlist);

    	break;

		case 'updatePos':
			//change the user icon the the according position
			$('#user' + msg.data[2]).css('top', msg.data[1]).css('left', msg.data[0]);
			console.log('user' + msg.data[2] + ' position updated');

		break;
	}
}

connection.onerror = function (err) {
	console.log(err);
}

function addNewUserImgs (userlist) {
	for (var i = 0; i < userlist.length; i++) {
		//checks if the user is new to the client
		if (!$('#user' + userlist[i]).length) {
			$("<img>", {'id':'user' + i,'src':'./icons/' + (i+1) + '.png'}).appendTo("body");
		};

	};
}