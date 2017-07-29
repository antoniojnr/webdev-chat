var express     = require('express')
var sse         = require('./sse')
var bodyParser  = require('body-parser')
var app         = express()
var connections = [];

app.use(express.static(__dirname + '/public'))
app.use('/scripts', express.static(__dirname + '/node_modules'))
app.use(bodyParser.json())
app.use(sse)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/stream', function(req, res) {
  res.header("Content-Type", "text/event-stream");
  res.header("Cache-Control", "no-cache");
  res.header("Connection", "keep-alive");
  res.header("Access-Control-Allow-Origin", "*");
  connections.push(res);
});

app.post('/chat', function(req, res) {
  for(var i = 0; i < connections.length; i++) {
    connections[i].sseSend({ user: req.body.user, line: req.body.line });
  }
  res.json({ success: true })
})

app.listen(3000, '0.0.0.0', function() {
  console.log('Server running...')
  console.log('You should be able to access this application within your LAN.')
})
