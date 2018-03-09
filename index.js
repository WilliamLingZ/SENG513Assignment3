var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/website/index.html');
});

io.on('connection', function(socket) {
	console.log('a user connected');
	console.log(socket.id);
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 10; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	console.log(text);
	socket.emit('userName', text);
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('chat', function(msg){
		var d = new Date();
		h = d.getHours().toString();
		m = d.getMinutes().toString();
		h = h.concat(':');
		h = h.concat(m);
		h = h.concat(')');
		msg = h.concat(msg);
		socket.broadcast.emit('chat', msg);
		msg = msg.bold();
		socket.emit('chat', msg);
    });
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});

