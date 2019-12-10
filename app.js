var express = require('express');
var app = express();
var fs = require('fs');
var axios = require('axios');

/**
 * 큐시트 시간 수정 2
 */
app.get('/api/change/cuesheet', function(req, res) {
  var startTime = req.query.startTime;
  var updateDuration = req.query.duration; // 변경 duration

  axios.get('http://localhost:3000/aws/api/ws/cuesheet/v2')
   .then(response => {
      var cuesheetItems = response.data.item.data[0].cuesheetItems;
      var newCuesheetItems = [];
      var isChange = false;
      var index = 0;
      var beforeTime = [];
      var beforeDuration = [];
      for (let item of cuesheetItems) { // 57
        beforeTime[index] = item.itemInfo[3];

        if (startTime == item.itemInfo[3] && isChange === false) {
          item.itemInfo[4] = updateDuration;  // 첫번재 item의 duration을 업데이트
          beforeDuration[index] = item.itemInfo[4];
          console.log("beforeDuration[index] : %o", beforeDuration[index]);
          isChange = true;
          console.log("duration update completed !!!")
        } else if (isChange) {

          // 이전 duration 정보를 가져온다. 
          console.log("test : %o", beforeDuration[index-1]);
          
          var beforeValue = parseInt(beforeDuration[index-1].substr(0,2)); // 0900
          var beforeStartM = parseInt(beforeTime[index-1].substr(2,2)); // 085900

          console.log("beforeValue : %o", beforeValue);
          console.log("beforeStartM : %o", beforeStartM);

          // 09 + 59
          var addResult = parseInt(beforeValue + beforeStartM);
          console.log("addResult : %o", addResult);
          if(addResult >= 60){
            console.log('1111')
            var hourValue = beforeTime[index-1].substr(0,2); // hh
            var updateHour = parseInt(hourValue) + 1;
            var hourValue = updateHour.toString();
            if(hourValue.length < 2) {
              var updateHourString = "0" + updateHour.toString();
              item.itemInfo[3] = item.itemInfo[3].replaceAt(0, updateHourString)
            } else if (hourValue.length == 2) {
              item.itemInfo[3] = item.itemInfo[3].replaceAt(0, (hourValue))
            }

            // mm update
            var minUpdate = ( addResult - 60 );
            console.log("minUpdate : %o", minUpdate);
            var minValue = minUpdate.toString();
            if(minValue.length < 2){
              minUpdate = "0" + minUpdate.toString();
              item.itemInfo[3] = item.itemInfo[3].replaceAt(2, (minUpdate.toString()))
            } else if (minValue.length == 2) {
              item.itemInfo[3] = item.itemInfo[3].replaceAt(2, (minValue))
            }

            console.log("update succeed !!! : %o", item.itemInfo[3]);
          } else if( addResult < 60 ){
            console.log('2222')
            var beforeHour = parseInt(beforeTime[index-1].substr(0,2));
            var currentHour = parseInt(beforeTime[index].substr(0,2));

            console.log('beforeHour : %o', beforeHour);
            console.log('currentHour : %o', currentHour);

            if( beforeHour == currentHour ){
              console.log('3333')
              // mm update
              console.log('addResult : %o', addResult);
              // var minUpdate = ( addResult - 60 );
              var minUpdate = addResult;
              var minValue = minUpdate.toString();
              if(minValue.length < 2){
                minUpdate = "0" + minUpdate.toString();
                item.itemInfo[3] = item.itemInfo[3].replaceAt(2, (minUpdate.toString()));
              } else if (minValue.length == 2) {
                item.itemInfo[3] = item.itemInfo[3].replaceAt(2, (minValue));
              }

              // item.itemInfo[3] = item.itemInfo[3].replaceAt(2, (minUpdate.toString()));
              console.log("update succeed !!! : %o", item.itemInfo[3]);

            } else if ( beforeHour < currentHour ) {
              console.log('4444')
              // 시간 update
              var currentHour = currentHour - 1;
              var currentValue = currentHour.toString();
              if(currentValue.length < 2) {
                var updateHourString = "0" + currentHour.toString();
                 item.itemInfo[3] = item.itemInfo[3].replaceAt(0, updateHourString)
              } else if (currentValue.length == 2) {
                 item.itemInfo[3] = item.itemInfo[3].replaceAt(0, (currentValue))
              }
              // mm update
              // 분을 업데이트 시킬때, 기존 분 + 기존 (업데이트된 duration시간으로 바꾸기)
              var minUpdate = parseInt(beforeTime[index-1].substr(2,2)) + 
                              parseInt(beforeDuration[index-1].substr(0,2));

              item.itemInfo[3] = item.itemInfo[3].replaceAt(2, (minUpdate.toString()));
              console.log("update succeed !!! : %o", item.itemInfo[3]);
            } else if ( beforeHour > currentHour ) {
              // 09:00 => 09:10 로 넘어가는 경우 
              console.log('5555')

              var currentHour = currentHour + 1;
              var currentValue = currentHour.toString();
              if(currentValue.length < 2) {
                var updateHourString = "0" + currentHour.toString();
                 item.itemInfo[3] = item.itemInfo[3].replaceAt(0, updateHourString)
              } else if (currentValue.length == 2) {
                 item.itemInfo[3] = item.itemInfo[3].replaceAt(0, (currentValue))
              }
              // mm update
              // 분을 업데이트 시킬때, 기존 분 + 기존 (업데이트된 duration시간으로 바꾸기)
              var minUpdate = parseInt(beforeTime[index-1].substr(2,2)) + 
                              parseInt(beforeDuration[index-1].substr(0,2));

              item.itemInfo[3] = item.itemInfo[3].replaceAt(2, (minUpdate.toString()));
              console.log("update succeed !!! : %o", item.itemInfo[3]);
            }
          }
        }

        beforeTime[index] = item.itemInfo[3];
        beforeDuration[index] = item.itemInfo[4];
        index++;
        newCuesheetItems.push(item)
      }
      response.data.item.data[0].cuesheetItems = newCuesheetItems;
      res.send(response.data)
   })
   .catch(err => console.log(err))
})

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function getCuesheet(){
  return app.get('/aws/api/ws/cuesheet/v2', function (req, res) {
    console.log('call WEBUI API quesheets...! 큐시트 변경 확인 API Call...')
    
    /**
     * 랜덤설정
    var cuesheetFiles = 4;
    var max = cuesheetFiles
    var randomIndex = Math.floor(Math.random() * (max - 0))
   */

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
