'use strict';

var express = require('express');
var socketIO = require('socket.io');
var path = require('path');

var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, 'index.html');
var CLIENTPATH = path.join(__dirname, 'client.html');
var HOSTPATH = path.join(__dirname, 'host.html');
var MONITORPATH = path.join(__dirname, 'monitor.html');

var data = {
  'clients': 0,
  'positions':{},
  'canvas':null,
  'host': false,
  'hostIDs':[],
  'totalConnections':0,
  'clientIDs':[],
  'clientObjects':[],
  'test': function() {
    console.log('test');
  }
};


var server = express()
  .get('/',(req, res) => res.sendFile(INDEX))
  .get('/client',(req, res) => res.sendFile(CLIENTPATH))
  .get('/host',(req, res) => res.sendFile(HOSTPATH))
  .get('/monitor',(req, res) => res.sendFile(MONITORPATH))
  .use("/styles",express.static(__dirname + "/styles"))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));



var io = socketIO(server);



io.on('connection', (socket) => {
  data.totalConnections = data.totalConnections+1;

  socket.on('clientConnected',function(){
    data.clientIDs.push(socket.id);
    data.positions[String(socket.id)] = [0,0];
    data.clients = data.clients + 1;

  });

  socket.on('hostConnected',function(){
    data.hostIDs.push(socket.id);
    data.host = true;
    // if(data.canvas != null){
    //   initCanvas();
    // }

  });



  socket.on('disconnect',function(){
    if(data.clientIDs.includes(socket.id)){
        delete data.positions[String(socket.id)];
        var index = data.clientIDs.indexOf(socket.id);
        data.clientIDs.splice(index, 1);
        data.clients = data.clients-1;
    }
    else if(data.hostIDs.includes(socket.id)){
        var index = data.hostIDs.indexOf(socket.id);
        data.hostIDs.splice(index, 1);
        if(data.hostIDs.length == 0){
          data.host = false;
        }
    }
    data.totalConnections = data.totalConnections-1
  });



});

// function initCanvas(data){
//   data.canvas = document.createElement('canvas');
//   data.ctx = canvas.getContext("2d");
//
// }
setInterval(() => io.emit('tick', data, 1000));
