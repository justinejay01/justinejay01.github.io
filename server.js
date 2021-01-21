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

const io = require('socket.io').listen(server);
server.listen(portAccess);

app.get('/', function(req,res) {
  res.sendFile('/index.html', {root: __dirname});
});

app.get('/programs', function(req,res) {
  res.sendFile('/programs/index.html', {root: __dirname});
});

app.get('/programs/csharp', function(req,res) {
  res.sendFile('/programs/csharp/index.html', {root: __dirname});
});

app.get('/programs/csharp/lesson-6', function(req,res) {
  res.sendFile('/programs/csharp/lesson-6.html', {root: __dirname});
});

app.get('/programs/csharp/lesson-7', function(req,res) {
  res.sendFile('/programs/csharp/lesson-7.html', {root: __dirname});
});

app.get('/tools', function(req,res) {
  res.sendFile('/tools/index.html', {root: __dirname});
});

app.get('/tools/gdrive-linkgen', function(req,res) {
  res.sendFile('/tools/gdrive-linkgen.html', {root: __dirname});
});

/*
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
*/
