var express = require('express');
var app = express();
var messageList = [];
var usernames = {}
var serverMsgs = ["ANYBODY HERE?", "TRYING TO FIGURE THIS THING OUT.", "FFFFFFFF", "GO RANGERS", "A/S/L", "HELLO?"]
var serverFakes = ["Boris", "chad", "PastaBot", "frodo", "Heisenberg"]
var randElement = function(arr){
  var randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};
var randMsg = randElement(serverMsgs)
var randUsr = randElement(serverFakes)

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res) {
  res.render("page");
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(process.env.PORT || 5000));

// ADDED for Heroku configuration -- remove to revert to normal websockets config
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (client) {

  messageList.forEach(function (element) {
    client.emit('message', element)
  });

  setInterval(function() {
    var message = {message: randMsg, username: randUsr}
    messageList.push(message)
    io.sockets.emit('message', message);
  }, 10000)

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