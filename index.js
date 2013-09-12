var express = require('express');
var app = express();
var port = 4101;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res) {
  res.render("page");
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));
console.log('Listening on port ' + port);

io.sockets.on('connection', function (clientEnd) {
  clientEnd.emit('message', { message: 'VERY NICE TO SEE YOU.' });
  clientEnd.on('send', function (data) {
    io.sockets.emit('message', data);
  })
})