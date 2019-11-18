var express = require('express');
var app = express();
var fs = require('fs');

app.get('/api/cuesheets/v2', function (req, res) {
  console.log('call WEBUI API quesheets...! 큐시트 변경 확인 API Call...')

  fs.readFile('cuesheet_v2.json', 'utf-8', function(err, data) {
    if(err){
        res.end('500 Internal Server Error : '+err);
      }else{
        res.send(data);
      }
  })
});

app.get('/api/cuesheets/dynamodb', function (req, res) {
  console.log('call dynamodb quesheets...! 이전 큐시트 요청...')

  fs.readFile('cuesheet_dynamodb.json', 'utf-8', function(err, data) {
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
