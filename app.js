var express = require('express');
var app = express();
var fs = require('fs');

var result = {}

app.get('/quesheets', function (req, res) {
  console.log('call quesheets...!')

  fs.readFile('quesheet.json', 'utf-8', function(err, data) {
    if(err){
        res.end('500 Internal Server Error : '+err);
      }else{
        result = JSON.parse(data)
        res.send(result);
      }
  })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
