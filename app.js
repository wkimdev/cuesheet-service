var express = require('express');
var app = express();
var fs = require('fs');
var axios = require('axios');
var callcuesheet = require('./callcuesheet.js');

/**
 * 큐시트 시간 수정
 * 
 * param : albumId, starttime, dutaion
 * 
 * data[0].cuesheetItems > itemInfo[5] > duration
 * 
 * api에서 파일을 읽는다
 * 요청받은 param에 대한 albumId검증 이후(dummy라 필요없음), 해당 itemInfo no값을 찾아서
 * 1. 그 itemInfo의 duraion수정
 * 2. 그 itemInfo의 '다음'itemInfo (index++)의 starttiem, durtaion수정 
 * 그 다음... 그래서 끝까지 수정 
 * 3. 파일을 쓴다. 
 * 
 * 4. res.send()를 한다. 
 * 
 */
app.get('/api/change/cuesheet/:startTime&:duration', function(req, res) {
  //var startTime = req.params.startTime;
  var startTime = '080000'; // 첫번째 시작시간 고정
  //var duration = req.params.duration;
  var duration = '0500'; // 변경 duration
  axios.get('http://localhost:3000/aws/api/ws/cuesheet/v2')
   .then(response => { 
      // console.log("test : %o", response.data.item.data[0].cuesheetItems)
      var cuesheetItems = response.data.item.data[0].cuesheetItems;
      // console.log("==============================================")
      // console.log("cuesheetItems test : %o", cuesheetItems[0])
      // console.log("startTime test : %o", startTime)
      var index = 0;
      for (let item of cuesheetItems) { // 57
        console.log("tes item : %o", item.itemInfo[3])
        var currentStartime = item.itemInfo[3]
        if(startTime == item.itemInfo[3]){
          console.log('duration value :'+item.itemInfo[4]) // 분 환산
          item.itemInfo[4] = duration;  // 현재시간의 duration을 업데이트
          break;
        }
      }
  
    })
   .catch(err => console.log(err))
})

function getCuesheet(){
  return app.get('/aws/api/ws/cuesheet/v2', function (req, res) {
    console.log('call WEBUI API quesheets...! 큐시트 변경 확인 API Call...')
  
   // 요청이 들어올때마다 랜덤하게 파일 응답
  
    var cuesheetFiles = 4;
    var max = cuesheetFiles
    var randomIndex = Math.floor(Math.random() * (max - 0))
  
    console.log('[ RandomIndex : %o ]', randomIndex)
  
    //fs.readFile('cuesheet_v' + randomIndex + '.json', 'utf-8', function(err, data) {
    fs.readFile('cuesheet_v0.json', 'utf-8', function(err, data) {
      if(err){
          res.end('500 Internal Server Error : '+err);
        }else{
          res.send(data);
          return data;
        }
    })
  });
}

app.get('/aws/api/cuesheets/dynamodb', function (req, res) {
  console.log('call dynamodb quesheets...! 이전 큐시트 요청...')
  
  fs.readFile('cuesheet_dynamodb.json', 'utf-8', function(err, data) {
    if(err){
      res.end('500 Internal Server Error : '+err);
    }else{
      res.send(data);
    }
  })
});

getCuesheet()

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
