var express = require('express');
var app = express()
var messageList = [];
var usernames = {}
var connected = 0;
var loopRunning = false;
var serverMsgs = ["HELLO?", "HELLO?", "HELLO?", "HELLO?", "HELLO?", "HELLO?", "HELLO?", "WHY DO WE HAVE TO CHOOSE BETWEEN SYRIA AND TWERKING. IT'S LIKE, A FALSE DICHOTOMY, MAN", "HELLO?", "THE PRICE OF ANYTHING IS THE AMOUNT OF LIFE YOU EXCHANGE FOR IT.", "IF WE HAD HAD MORE TIME FOR DISCUSSION WE SHOULD PROBABLY HAVE MADE A GREAT MANY MORE MISTAKES.", "HELLO?", "HELLO?", "HELLO?", "HELLO?", "HELLO?", "HELLO?", "HELLO?", "HELLO?", "HELLO?", "THX 1138, WHY AREN'T YOU AT YOUR POST?", "HELLO?"]
var serverFakes = ["Server", "Server", "Server", "Server", "Heisenberg", "Server", "Server", "larr_ellis1", "Server", "Server", "Server", "Server"]
var randRange = function(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min)
}
var randElement = function(arr){
  var randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

var pushFake = function () {
  var randMsg = randElement(serverMsgs)
  var randUsr = randElement(serverFakes)
  var message = {message: randMsg, username: randUsr}
  messageList.push(message)
  io.sockets.emit('message', message);
};

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res) {
  res.render("page");
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(4101));

io.sockets.on('connection', function (client) {
  connected += 1

  setTimeout(function() {
    pushFake();
  }, 7000);

  messageList.forEach(function (element) {
    client.emit('message', element)
  });

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
    }
  });

  client.on('disconnect', function() {
    connected -= 1
    client.get('username', function(err, name) {
      if (name) {
        delete usernames[name]
        var message = {message: ' left.', username: name, uEvent: "leave"}
        messageList.push(message)
        client.broadcast.emit('message', message)
      }
    })
  });

  client.on('send', function (data) {
    client.get('username', function(err, name) {
      var message = {message: data, username: name}
      messageList.push(message)
      io.sockets.emit('message', message);
      messageList.length > 10 && messageList.shift();
      // NOBODY WANTS TO SHOUT ABOUT YESTERDAY'S NEWS.
    });
  });
})
