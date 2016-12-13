var express = require('express');
var io = require('socket.io');
var app = express();
app.get('/', function(req, res) {
  res.send('Hello World!');
})
app.listen(5000, function() {
  console.log("Node app is running");
})