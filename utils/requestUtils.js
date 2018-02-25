var md5 = require('../utils/md5.js');



function requestWXData(that,dataType, requsetType, content, Pri, callBack, failCll) {
  var userToken = wx.getStorageSync("userToken");
  console.log('-----userToken--', userToken)
  var header = {
    'RudderAppType': 'mini',
    'RudderMarket': 'mini',
    //微信版本号
    'RudderVersion': "1.0",
  }
  if (userToken) {
    if (dataType== "JAVA") {
      header['X-Auth-Token'] = userToken;
    }else {
      header.UserToken = userToken
    }
   
    //
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
      console.log(res);
      if (res.statusCode == 200) {
        if (res.data != '' || !res.data.body) {
          if (dataType == "JAVA") {
            if (res.data.status == 200) {
              if (typeof callBack == 'function')
                callBack(res);
            } else {
              if (res.data.message != undefined) {
                console.log('----fail---', res)
                showModelFun(res.data.message, false);
              }
              console.log(res);
              if (typeof failCll == 'function')
                failCll(res);
            }
          } else {
            if (res.data.code == 0) {
              // var dataList = JSON.parse(res.data.body);
              if (typeof callBack == 'function')
                callBack(res);
            } else {
              if (res.data.message != undefined) {
                console.log('----fail---', res)
                showModelFun(res.data.message, false);
              }
              console.log(res);
              if (typeof failCll == 'function')
                failCll(res);
            }
          }
        
        } else {
          showError();
          that.setData({
            hiddenloading: true
          })
          console.log(res);
          // if (typeof callBack == 'function')
          //   callBack(res.data);
        }
      } else {
        showError();
        that.setData({
          hiddenloading: true
        })
        console.log(res.errMsg);
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

// function requestWXData(that, requsetType, content, Pri, callBack, failCll) {
//   var userToken = wx.getStorageSync("userToken");
//   console.log('-----userToken--', userToken)
//   //追加统计的头信息，优先获取native传递的头信息
//   var header = {
//     'RudderAppType': 'mini',
//     'RudderMarket': 'mini',
//     //微信版本号
//     'RudderVersion': "1.0",

//   }
//   if (userToken) {
//     header['X-Auth-Token'] = userToken;
//     // header.UserToken = userToken
//     // header.Accept = 'application/x-www-form-urlencoded',
//     // header['content-type'] = "application/x-www-form-urlencoded"
//     // header.content-type = "application/x-www-form-urlencoded"
//   }

//   wx.request({
//     method: requsetType,
//     url: Pri,
//     data: content,
//     header: header,
//     success: function (res) {
//       console.log(res);
//       if (res.statusCode == 200) {
//         if (res.data != '' || !res.data.body) {
//           if (res.data.statusCode == 200) {
//             // var dataList = JSON.parse(res.data.body);
//             if (typeof callBack == 'function')
//               callBack(res);
//           } else {
//             if (res.data.message != undefined) {
//               showModelFun(res.data.message, false);
//             }
//             console.log(res);
//             if (typeof failCll == 'function')
//               failCll(res);
//           }
//         } else {
//           showError();
//           that.setData({
//             hiddenloading: true
//           })
//           console.log(res);
//           // if (typeof callBack == 'function')
//           //   callBack(res.data);
//         }
//       } else {
//         showError();
//         that.setData({
//           hiddenloading: true
//         })
//         console.log(res.errMsg);
//         if (typeof failCll == 'function')
//           failCll(res.data);

//         return false;
//       }


//     },
//     fail: function (res) {
//       showError();
//       that.setData({
//         hiddenloading: true
//       })
//       if (typeof failCll == 'function')
//         failCll(res.data);
//     }

//   })
// }

function showModelFun(msg, bool, call) {
  wx.showModal({
    confirmColor: "#e02e24",
    content: msg,
    showCancel: bool,
    success: function (data) {
      if (typeof call == 'function')
        call(data);
    }
  })
}

// 网络错误弹窗
function showError() {
  wx.showToast({
    title: '请检查网络连接',
    icon: 'success',
    image: '/images/error.png'
  })
}

module.exports = {
  // NewGuid: NewGuid,
  // PostAjax: PostAjax,
  // UserPostAjax: UserPostAjax,
  // PostGetUserAjax: PostGetUserAjax,
  showModelFun: showModelFun,
  showError: showError,
  // requestData: requestData,
  requestWXData: requestWXData
  // requestAccessToken: requestAccessToken
}

