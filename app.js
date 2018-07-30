var redis = require('redis'),
    port = 6379,
	host = '127.0.0.1',
    opts = {}, //opts={auth_pass:rds_pwd}
    client = redis.createClient(port,host,opts),
    subscriber = redis.createClient(port,host,opts),
    publisher  = redis.createClient(port,host,opts);

var fs = require('fs'),
 url = require('url'),
 app = require('http').createServer(function(req, res) {
 	var filename = '',
 	resource = url.parse(req.url).pathname;
 	switch(resource) {
 		default:
 			filename = __dirname + '/test831.html';
 			res.setHeader('Content-Type', 'text/html');
 			break;
 	}
 	fs.readFile(filename, function(err, data) {
 		if(err) {
 			res.writeHead(500);
 			return res.end('Error reading resource.');
 		} else {
 			res.writeHead(200);
 			res.end(data);
 		}
 	});
 }),
 
 nicknames = {},
 io = require('socket.io').listen(app);
 subscriber.on("message", function(channel, message) {
    console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
    io.to(channel).emit('msg', JSON.parse(message));
});
 io.sockets.on('connection', function(socket) {
    temp_socket = socket;
 	socket.on('join', function(m) {
        subscriber.subscribe(m.room);
        console.log(m);
        socket.join(m.room);
        socket['nickname'] = m.name;
        socket['room'] = m.room;
        socket.emit('joinroomsuccess', {room:m});
 	});
    
 	socket.on('leave', function() {
 		if(typeof socket['room'] !== 'undefined') {
 			socket.leave(socket['room']);
 			delete socket['room'];
 		}
 	});
 	socket.on('post', function(m) {
        data= JSON.stringify(m)
        publisher.publish(socket['room'], data);
        string = JSON.parse(data)
 	});

 	socket.on('disconnect', function() {
 		if(typeof socket['room'] !== 'undefined') {
 			socket.broadcast.in(socket['room']).emit('system', socket['nickname'] + ' has left this room.');// 6
 		}
 	});
 });
 
 app.listen(3000);
