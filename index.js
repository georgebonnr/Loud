var express = require('express');
var app = express();
var port = 4101;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res) {
  res.render("page");
});

app.use(express.static(__dirname + 'public'));

app.listen(port);
console.log('Listening on port ' + port);