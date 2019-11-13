var express = require('express');
var app = express();
var fs = require('fs');

var result = {}

app.get('/api/quesheets/v2', function (req, res) {
  console.log('call WEBUI API quesheets...!')

  fs.readFile('quesheet.json', 'utf-8', function(err, data) {
    if(err){
        res.end('500 Internal Server Error : '+err);
      }else{
        res.send(data);
      }
  })
});

app.get('/api/quesheets/v3', function (req, res) {
  console.log('call dynamodb quesheets...!')

  fs.readFile('quesheet2.json', 'utf-8', function(err, data) {
    if(err){
        res.end('500 Internal Server Error : '+err);
      }else{
        res.send(data);
      }
  })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
