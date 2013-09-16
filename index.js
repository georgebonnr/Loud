var express = require('express');
var app = express();
var port = 4101;
var messageList = [];
var usernames = {}

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res) {
  res.render("page");
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));
console.log('Listening on port ' + port);



io.sockets.on('connection', function (client) {
  // var getU = client.get('username', function(err, name) {
  //     return name
  //   });

  // var store = function(data, name, uEvent) {
  //   var message = {message: data, username: name, uEvent: uEvent}
  //   messageList.push(message)
  // };

  messageList.forEach(function (element) {
    client.emit('message', element)
  });

  console.log('client connected')

  client.on('uRequest', function (name, reply) {
    if (usernames[name]) {
      reply('Already taken! Try something else.')
    } else {
      var message = {message: ' joined in.', username: name, uEvent: "join"}
      client.set('username', name)
      usernames[name] = name
      reply('username added')
      messageList.push(message)
      io.sockets.emit('message', message)
      console.log(usernames)
    }
  });

  client.on('disconnect', function() {
    client.get('username', function(err, name) {
      if (name) {
        delete usernames[name]
        var message = {message: ' is gone.', username: name, uEvent: "leave"}
        messageList.push(message)
        client.broadcast.emit('message', message)
      }
    })
  });

  client.on('send', function (data) {
    // var chat = message
    // console.log('before get ' + message)
    client.get('username', function(err, name) {
      var message = {message: data, username: name}
      messageList.push(message)
      io.sockets.emit('message', message);
      messageList.length > 10 && messageList.shift();
      // NOBODY WANTS TO SHOUT ABOUT YESTERDAY'S NEWS.
      // console.log(messageList.length)
    });
  });
})