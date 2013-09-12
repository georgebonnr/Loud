window.onload = function() {

  var messages = [];
  var server = io.connect('http://localhost:4101');
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");

  server.on('message', function (data) {
    if (data.message) {
      messages.push(data.message);
      var html = '';
      for (var i = 0; i < messages.length; i++) {
        html += messages[i] + '<br />';
      }
      content.innerHTML = html;
    } else {
      console.log("Did not get message from server")
    }
  });

  sendButton.onclick = function() {
    var text = field.value;
    server.emit('send', { message: text })
  }
}