var express     = require('express')
var sse         = require('./sse')
var bodyParser  = require('body-parser')
var jade        = require('jade')
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

app.get('/consts.js', function(req, res){
    res.send("var API='" + process.env.HOST + "'");
});

app.get('/test', function(req, res) {
  res.send("It's working")
})

app.get('/stream', function(req, res) {
  res.header("Content-Type", "text/event-stream");
  res.header("Cache-Control", "no-cache");
  res.header("Connection", "keep-alive");
  res.header("Access-Control-Allow-Origin", "*");
  connections.push(res);
});

app.post('/chat', function(req, res) {
  for(var i = 0; i < connections.length; i++) {
    var username = req.body.user || 'Desconhecido';
    connections[i].sseSend({ user: username, line: req.body.line, ip: req.ip });
  }

  res.json({ success: true })
})

// Uncomment this if you're running this application in your computer
//
// app.listen(3000, '0.0.0.0', function() {
//   console.log('Server running...')
//   console.log('You should be able to access this application within your LAN.')
// })

// The lines below set up this application to run on Heroku

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Server running on port: ' + server.address().port)
})
