var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.get('*', function(req, res){
    res.sendfile(req.url.substr(1));
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('disconnectPlayer', socket.id);
    });

    socket.on('move', function(msg){
        io.emit('move', msg);
    });

    socket.on('newPlayer', function(data){
        var x,y,id
        ;

        x = Math.floor(Math.random() * 500);
        y = Math.floor(Math.random() * 500);
        // id = uuid.v1();

        socket.emit('newPlayer', {
            'x':x,
            'y':y,
            'playerCustomData' : {
                'id': socket.id,
                'tint' : "0x" + (Math.floor(Math.random() * 160) * 1000000).toString(16),
                'name': data.name
            }
        });
    });

    socket.on('reborn', function(data){
        io.emit('rebornPlayer', data);
    });

    // socket.on('chat message', function(msg){
    //   console.log('message: ' + msg);
    //   io.emit('chat message', msg);
    // });
});

http.listen(3333, function(){
  console.log('listening on *:3333');
});


