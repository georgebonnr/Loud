var express = require('express');
var app = express();
var port = 4101;

app.get("/", function(req, res) {
  res.send("It works!");
});

app.listen(port);
console.log('Listening on port ' + port);