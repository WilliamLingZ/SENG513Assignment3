var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chatHistory = [];
var users = [];

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/website/index.html');
});

io.on('connection', function(socket) {
	console.log('a user connected');
	console.log(socket.id);
	var name = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 10; i++)
		name += possible.charAt(Math.floor(Math.random() * possible.length));
	console.log(name);
	socket.emit('userName', name);
	users.push(name);
	socket.broadcast.emit('newUser', name);
	for(i = 0; i < users.length; i++) {
		socket.emit('newUser', users[i]);
	}
	for(i = chatHistory.length; i > 0; i--) {
		socket.emit('chat', chatHistory[i - 1]);
	}
	
	socket.on('disconnect', function() {
		for(i = 0; i < users.length; i++) {
			if(name == users[i]) {
				users.splice(i, 1);
			}
		}
		io.emit('removeUser', name);
		console.log('user disconnected');
	});
	
	socket.on('namechangeremove', function(msg) {
		for(i = 0; i < users.length; i++) {
			if(name == users[i]) {
				users.splice(i, 1);
				break;
			}
		}
		io.emit('removeUser', msg);
	});

	socket.on('namechangeadd', function(msg) {
		users.push(msg);
		io.emit('newUser', msg);
		name = msg;
	});
	
	socket.on('chat', function(msg){
		var d = new Date();
		var returnToSender;
		h = d.getHours().toString();
		m = d.getMinutes().toString();
		if(m.length == 1) {
			m = '0' + m;
		}
		msg = h + ':' + m + ')' + msg;
		socket.broadcast.emit('chat', msg);
		socket.emit('chat', msg.bold());
		chatHistory.unshift(msg);
		if(chatHistory.length > 200) {
			chatHistory.pop();
		}
    });
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});

