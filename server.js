const { createServer }  = require('http');
const NATS = require('nats')
const express = require('express');
const WebSocket=require('ws');
const app=express();
app.use(express.json({ extended: false}));
app.use(express.static('public'));

const nc = NATS.connect("global.appkata-6pn-nats.internal");

var port = process.env.PORT || 3000;
const server=new WebSocket.Server({ server:app.listen(port) });

nc.on('connect',()=> {
  console.log('Connected to'+ nc);
  nc.subscribe('msg', (msg) => {
    server.clients.forEach( client => {
      client.send(msg);
    })
  })
});


server.on('connection', (socket) => {
  socket.on('message', (msg) => {
    nc.publish('msg',msg);
  });
});