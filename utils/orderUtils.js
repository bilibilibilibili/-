//根据订单状态status获取文字(我的订单)
function obtainOrderStatus(status) {
  var statusStr = "";
  if (status== 2){
    statusStr = "待发货"
  }else if (status == 3){
    statusStr = "待收货"
  } else if (status == 4) {
    statusStr = "交易完成"
  } else if (status == 5) {
    statusStr = "待支付"
  } else if (status == 6) {
    statusStr = "交易关闭"
  } else if (status == 9) {
    statusStr = "已支付待成团"
  }
  return statusStr
}
//根据订单状态status获取物流状态(物流信息)
 
function obtainLogisticsStatus(status) {
  var statusStr = "";
  if (status == 2) {
    statusStr = "疑难"
  } else if (status == 3) {
    statusStr = "已签收"
  } else if (status == 4) {
    statusStr = "退签"
  } else if (status == 5) {
    statusStr = "同城派送中"
  } else if (status == 6) {
    statusStr = "退回"
  } else if (status == 7) {
    statusStr = "转单"
  } else if (status == 0) {
    statusStr = "在途中"
  } else if (status == 1) {
    statusStr = "已揽收"
  }
  return statusStr
}
//根据订单状态status获取操作按钮(我的订单)
function obtainOrderOptionAry(status, isActivityOrder) {
  var optionAry=[]
  if (status == 4 || status == 6) {
    optionAry=[
     {
        "optionText": "删除订单",
        "optionId":1
     }
    ]
  } else if (status == 3) {
    optionAry = [
      {
        "optionText": "查看物流",
        "optionId": 2
      },
      {
        "optionText": "确认收货",
        "optionId": 3
      }
    ]
  } else if (status == 5) {
    optionAry = [
      {
        "optionText": "去支付",
        "optionId": 4
      },
      
    ]
  } else if (status == 2) {
    optionAry = [
      

    ]
  }
  else {
    if (isActivityOrder == 0) {
      optionAry = [
        {
          "optionText": "再次购买",
          "optionId": 6
        },

      ]
    }
  }
  // else if (status == 5) {
  //   statusStr = "待支付"
  // } else if (status == 6) {
  //   statusStr = "交易关闭"
  // } else if (status == 9) {
  //   statusStr = "已支付待成团"
  // }
  return optionAry
  // return str.replace(/[\r\n]/g, "");
}
//根据订单状态status获取操作按钮(我的活动)
function obtainActiveOptionAry(activeStaus, missingNum,teamType) {
  var optionAry = [];
  if (activeStaus == 1) {
    if (missingNum == 0) {
      optionAry = [
        {
          "optionText": "查看订单",
          "optionId": 11
        },
        {
          "optionText": "查看团详情",
          "optionId": 12
        }
      ]
    } else {
      optionAry = [
        {
          "optionText": "邀请好友",
          "optionId": 13
        },
        
        {
          "optionText": "查看团详情",
          "optionId": 12
        },
        {
          "optionText": "查看订单",
          "optionId": 11
        },
      ]
    }
  } else {
    if (teamType != 1){
      optionAry = [
        {
          "optionText": "查看团详情",
          "optionId": 12
        },
        {
          "optionText": "中奖名单",
          "optionId": 14
        }

      ]
    }else {
      optionAry = [
        {
          "optionText": "查看团详情",
          "optionId": 12
        },
        {
          "optionText": "查看订单",
          "optionId": 11
        }

      ]
    }
    
  }
  return optionAry
}
//根据订单状态status获取操作按钮(订单详情)---(从我的活动入口进入)
function obtainActiveDetailOptionAry(activeStaus,teamType) {
  var optionAry = [];
  if (activeStaus == 1) {
    optionAry = [
      {
        "optionText": "邀请好友",
        "optionId": 13
      },

      {
        "optionText": "查看团详情",
        "optionId": 12
      }]
  } else {
    if (teamType != 1) {
      optionAry = [
        {
          "optionText": "查看团详情",
          "optionId": 12
        },
        {
          "optionText": "中奖名单",
          "optionId": 14
        }

      ]
    } else {
      optionAry = [
        {
          "optionText": "查看团详情",
          "optionId": 12
        }
      ]
    }

  }
  return optionAry
}
function fmtDate (inputTime) {
  var date = new Date(inputTime * 1000);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  h = checkTime(h) + ':';
  m = checkTime(m) + ':';
  s = checkTime(s);
  return Y + M + D + h + m + s
  // console.log('----倒计时-', Y + M + D + h + m + s);

}
function checkTime(i) { //时分秒为个位，用0补齐
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function PostGetUserAjax(that, requsetType, content, Pri, callBack, failCll) {
  var userToken = wx.getStorageSync("userToken");
  console.log('-----userToken--', userToken)
  //追加统计的头信息，优先获取native传递的头信息
  var header = {
    'RudderAppType': 'mini',
    'RudderMarket': 'mini',
    //微信版本号
    'RudderVersion': "1.0",

  }
  if (userToken) {
    header['X-Auth-Token'] = userToken;
    // header.X-Auth-Token = userToken
    // header.Accept = 'application/x-www-form-urlencoded',
    // header['content-type'] = "application/x-www-form-urlencoded"
    // header.content-type = "application/x-www-form-urlencoded"
  }

  wx.request({
    method: requsetType,
    url: Pri,
    data: content,
    header: header,
    success: function (res) {
      // console.log(res);
      if (res.statusCode == 200) {
        if (res.data != '' || !res.data.body) {
          if (res.data.code == 0) {
            // var dataList = JSON.parse(res.data.body);
            if (typeof callBack == 'function')
              callBack(res);
          } else {
            if (res.data.message != undefined) {
              showModelFun(res.data.message, false);
            }
            // console.log(res);
            if (typeof failCll == 'function')
              failCll(res);
          }
        } else {
          showError();
          that.setData({
            hiddenloading: true
          })
        }
      } else {
        showError();
        that.setData({
          hiddenloading: true
        })
        if (typeof failCll == 'function')
          failCll(res.data);
        return false;
      }
    },
    fail: function (res) {
      showError();
      that.setData({
        hiddenloading: true
      })
      if (typeof failCll == 'function')
        failCll(res.data);
    }
  })
}
module.exports = {
  obtainOrderStatus: obtainOrderStatus,
  obtainOrderOptionAry: obtainOrderOptionAry,
  fmtDate: fmtDate,
  checkTime: checkTime,
  PostGetUserAjax: PostGetUserAjax,
  obtainActiveOptionAry: obtainActiveOptionAry,
  obtainActiveDetailOptionAry: obtainActiveDetailOptionAry,
  obtainLogisticsStatus: obtainLogisticsStatus
}
