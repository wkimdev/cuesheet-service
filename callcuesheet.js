var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('step2');
    res.send('11');
});

module.exports = router;

// var app = express();

// app.get('/aws/api/ws/cuesheet/v2', function (req, res) {
//     console.log('111')
//     fs.readFile('cuesheet_v0.json', 'utf-8', function(err, data) {
//          if(err){
//              res.end('500 Internal Server Error : '+err);
//          }else{
//             console.log(data)
//             res.send(data);
//          }
//     })
// });
// module.exports = app;