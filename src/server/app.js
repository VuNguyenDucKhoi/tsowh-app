var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on("connection", function (socket) {
    console.log(socket.id);
    socket.on('update', () => {
        console.log('update')
        io.emit('update')});
})
// sed -i "s/interpolate/interpolateNode/g" node_modules/react-navigation-drawer/lib/module/views/Drawer.js