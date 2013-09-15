$(document).ready(function() {

  var messages = [];
  var localUser;
  var server = io.connect('http://localhost:4101');
  var field = document.getElementById("field");
  var content = document.getElementById("content");
  var name = document.getElementById("name");
  var $chats = $(".chat");



  // server.on('chats', function (data) {
  //   $chats.html(" ")
  //   for (var i=0; i < data.length; i++) {
  //     var $chatItem = $('<div class="chatItem"></div>')
  //     console.log(data[i])
  //     var usernameHTML = data[i].username
  //     var message = data[i].message
  //     $chatItem.append(usernameHTML + " " + message)
  //     $chats.append($chatItem)
  //   }
  // });

  server.on('message', function(data) {
    console.log(data)
  })

  server.on('newUserNotice', function (data) {

    window.alert(data.username);
  });

  $('#namesend').on('click', function(e) {
    e.preventDefault;
    server.emit('uRequest', name.value, function(data) {
      console.log(data)
    })
  })

  $('#send').on('click', function(e) {
    e.preventDefault;
    // server.emit('newUser', { message: name.value });
    // var text = $('.field').value().toUpperCase();
    var text = 'blah blah blah'
    server.emit('send', text);
    field.value = "";
  });
});