window.onload = function() {

  var messages = [];
  var server = io.connect('http://localhost:4101');
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");
  var name = document.getElementById("name");

  server.on('message', function (data) {
    if (data.message) {
      messages.push(data);
      var html = '';
      for (var i = 0; i < messages.length; i++) {
        html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
        html += messages[i].message + '<br />';
      }
      content.innerHTML = html;
      content.scrollTop = content.scrollHeight;
    } else {
      console.log("Did not get message from server", data)
    }
  });

  sendButton.onclick = function() {
    if (!name.value) {
      alert("ENTER NAME")
    } else {
      var text = field.value;
      server.emit('send', { message: text, username: name.value });
      field.value = "";
    }
  }
}