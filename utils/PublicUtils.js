var md5 = require('../utils/md5.js');
var searchRemind = '请输入搜索条件';
var realeName ="https://m.meigo.com";
//JS生成GUID函数,类似.net中的NewID();
// function S4() {
//   return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
// }
// function NewGuid() {
//   return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
// }
// 请求.net方法封装
// loadH 加载完成是否影藏 loading  1为不影藏
// loadS 加载中是否显示 loading 1为不加载
function PostAjax(that, requsetType, content, Pri, callBack,failCll) {
 
  wx.request({
    method: requsetType,
    url: Pri,
    data: content,
    header: {
      'content-type': 'application/json',
    },
    success: function (res) {
      console.log(res);
      if (res.statusCode == 200) {
        if (res.data != ''  || !res.data.body) {
          if (res.data.code == 0 ) {
            // var dataList = JSON.parse(res.data.body);
            if (typeof callBack == 'function')
              callBack(res);
          }else {
            if (res.data.message !=undefined){
              showModelFun(res.data.message, false);
            }
            if (typeof failCll == 'function')
              failCll(res);
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
//需要校验用户信息
function UserPostAjax(that, requsetType, content, Pri, callBack, failCll) {
  // content: JSON.stringify(content)
  // var appHeader = wx.getStorageSync("appHeader");
  var userToken = wx.getStorageSync("userToken");
  console.log('-----userToken--', userToken)
  //追加统计的头信息，优先获取native传递的头信息
  var header = {
    'RudderAppType': 'mini',
    'RudderMarket': 'mini',
    //微信版本号
    'RudderVersion':"1.0",
    
  }
  if (userToken) {
    header.UserToken = userToken,
    header.Accept = 'application/x-www-form-urlencoded',
    header['content-type'] ="application/x-www-form-urlencoded"
    // header.content-type = "application/x-www-form-urlencoded"
  }
  
  console.log('-----header---', header)
  // if (appHeader) {
  //   //转换native内嵌微官网的参数，头信息约定参数命名规则改成驼峰命名
  //   if (appHeader.rudder_appType) {
  //     header.RudderAppType = appHeader.rudder_appType;
  //     header.RudderMarket = appHeader.rudder_market;
  //     header.RudderDeviceId = appHeader.rudder_deviceId;
  //     header.RudderActivityId = appHeader.rudder_activityId;
  //     header.RudderDeviceInfo = appHeader.rudder_deviceInfo;
  //   } else {
  //     header = appHeader;
  //   }
    
  // }
  wx.request({
    method: requsetType,
    url: Pri,
    data: content,
    header: header,
    dataType:"txt",
    // header: {
    //   'content-type': 'application/json',
    //   "headers": JSON.stringify(header),
    // },
    success: function (res) {
      if (res.statusCode == 200) {
        if (res.data != '' || !res.data.body) {
          // console.log('-----res',res)
          // console.log('------------dddd-----', res.data)
          var data = JSON.parse(res.data)
          // console.log('------------2222-----', body.body)
          console.log('--code----', data.code);

          if (data.code == 0) {
            console.log('--code---eee-');

            // callBack("---sub----", body);
            if (typeof callBack == 'function')
              callBack(data);
          }else {
            if (res.data.message !=undefined){
              showModelFun(res.data.message, false);
              that.setData({
                hiddenloading: true
              })
            }
            console.log(res);
            callBack("---22b----", res.data);
          }
        } else {
          showError();
          that.setData({
            hiddenloading: true
          })
          console.log(res);
          if (typeof callBack == 'function')
            callBack(res.data);
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
    header.UserToken = userToken
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
          if (res.data.code == 0) {
            // var dataList = JSON.parse(res.data.body);
            if (typeof callBack == 'function')
              callBack(res);
          } else {
            if (res.data.message != undefined) {
              showModelFun(res.data.message, false);
            }
            console.log(res);
            if (typeof failCll == 'function')
              failCll(res);
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

// 请求二次封装
// that  page对象
// con  请求参数
// pri  接口名称
// call  成功回调
// failCll 失败回调
// loadH 请求完成是否影藏loading效果   1  为不影藏，其余为影藏；
// loadS 请求是否显示loading效果       1  为不显示，其余为显示；
// msgShow 是否显示错误弹窗            1  为不显示  其余为显示
// function postData(that, con, pri, call, failCll, loadH, loadS, msgShow) {
//   PostAjax(that, con, pri, false, function (data) {
//     console.log(data)
//     that.data.onoff = true;
//     if (data.Status == 0 && data.Data != '') {
//       var dataList = JSON.parse(data.Data);
//       if (dataList != '' && dataList.status == 200) {
//         // console.log(dataList);  
//         if (typeof call == 'function')
//           call(dataList);
//       } else {
//         if (msgShow != 1) {
//           showModelFun(dataList.msg, false);
//         }
//         if (typeof failCll == 'function')
//           failCll(dataList);
//       }
//     }
//   }, loadH, loadS, failCll)
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
// 去换行 /n
function strTrim(str) {
  return str.replace(/[\r\n]/g, "");
}
// 去空格
function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, "");
}
// 网络错误弹窗
function showError() {
  wx.showToast({
    title: '请检查网络连接',
    icon: 'success',
    image: '/images/error.png'
  })
}
//倒计时
function callBackLeftTimeByTimestamp (timestamp, endtime, callBack) {
  // var that = this;
  var showTime = parseInt(endtime) - parseInt(timestamp);
  var nD = '';
  var nH = '';
  var nM = '';
  var nS = '';
  nD = Math.floor(showTime / (60 * 60 * 24));
  nH = Math.floor(showTime / (60 * 60)) % 24;
  nM = Math.floor(showTime / 60) % 60;
  nS = Math.floor(showTime) % 60;
  if (timestamp > 9999999999) {
    nD = Math.floor(showTime / (60 * 60 * 24 * 1000));
    nH = Math.floor(showTime / (60 * 60 * 1000)) % 24;
    nM = Math.floor(showTime / (60 * 1000)) % 60;
    nS = Math.floor(showTime / 1000) % 60;

  }
  nD = checkTime(nD);
  nH = checkTime(nH);
  nM = checkTime(nM);
  nS = checkTime(nS);
  callBack(nD, nH, nM, nS)
  // console.log('---------', nD, nH, nM, nS)
}
function checkTime (i) { //时分秒为个位，用0补齐
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽  
  var originalHeight = e.detail.height;//图片原始高  
  var originalScale = originalHeight / originalWidth;//图片高宽比  
  console.log('originalWidth: ' + originalWidth)
  console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高  
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比  
      console.log('windowWidth: ' + windowWidth)
      console.log('windowHeight: ' + windowHeight)
      if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比  
        //图片缩放后的宽为屏幕宽  
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else {//图片高宽比大于屏幕高宽比  
        //图片缩放后的高为屏幕高  
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }

    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}  
module.exports = {
  // NewGuid: NewGuid,
  PostAjax: PostAjax,
  UserPostAjax: UserPostAjax,
  PostGetUserAjax: PostGetUserAjax,
  searchRemind: searchRemind,
  realeName: realeName,
  // postData: postData,
  showModelFun: showModelFun,
  strTrim: strTrim,
  trim: trim,
  showError: showError,
  checkTime: checkTime,
  callBackLeftTimeByTimestamp: callBackLeftTimeByTimestamp,
  imageUtil: imageUtil
  // requestAccessToken: requestAccessToken
}

