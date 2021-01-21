const fs = require('fs');
const path = require('path');

const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);

const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');

var portAccess = process.env.PORT || 8080;

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

//var server = app
const io = require('socket.io').listen(server);
server.listen(portAccess);

app.get('/', function(req,res) {
  res.sendFile('/index.html', {root: __dirname});
  io.on("connection", function(socket) {

    console.log('socket connected');

  });
});

io.on("connection", function(socket) {
  console.log("Connected!");
});

app.get('/t', function(req,res){
  var q = req.query.q;
  var token = jwt.sign({videoId: q}, prv, {expiresIn: '3hr', algorithm: 'RS256'});
  res.send(token);
});

function getToken(q){
  return jwt.sign({videoId: q}, prv, {expiresIn: '3hr', algorithm: 'RS256'});
};

app.get('/vt', function(req,res){
  var q = req.query.q;
  jwt.verify(q, pub, function (err, dec){
    if(err) res.send('Invalid token!');
    else res.send('True');
  });
});
