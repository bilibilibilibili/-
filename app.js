//app.js
App({
  onLaunch: function () {
    this.InitUserData();
    this.getSystemInformation()
    
  },
  
  InitUserData: function () {
    // console.log(1);
    var that = this
    var userData = wx.getStorageSync("UserData");
    if (userData != '' && userData != null) {
      that.globalData.UserData = userData
      that.globalData.IsInit = true
     
    } else {
      
      that.getUserInfo()
    }
  },
  //获取手机信息
  getSystemInformation:function(){
    wx.getSystemInfo({
      success: function (res) {
        // console.log("--------platform--------",res.platform)
        wx.setStorageSync('platform', res.platform);
      }
    })
  },
  

  getUserInfo: function () {
    var that = this
    // if (that.onOff) {
      if (this.globalData.userInfo) {
        typeof cb == "function" && cb(this.globalData.userInfo)
      } else {
        // console.log(5);
        //调用登录接口
        wx.login({
          success: function (loginres) {
            var cont = { code: loginres.code,}
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                cont.nickname = res.userInfo.nickname;
                cont.avatar = res.userInfo.avatarUrl;
                cont.gender = res.userInfo.gender;
                cont.city = res.userInfo.city;
                cont.province = res.userInfo.province;
                cont.country = res.userInfo.country;
                wx.setStorage({
                  key:'userInfo',
                  data:res.userInfo
                })
              } ,fail: function () {
              }
              
            })
            wx.request({
              method: "GET",
              url: 'https://m.meigo.com/wechat/mini/autoLogin', //仅为示例，并非真实的接口地址
              data: cont,
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                wx.setStorageSync('openid', res.data.body.openid);
                wx.setStorageSync('userId', res.data.body.userId);
                wx.setStorageSync('userToken', res.data.body.ssid);
                var openid = wx.getStorageSync('openid');
                var userToken = wx.getStorageSync("userToken");
              }
            })
            
          },
          fail: function () {
            wx.setStorageSync('isSuccess', 'fail');
          }
        })
      }
  },

  globalData: {
    userInfo: null,
    UserData: null,
    IsInit: false,
    openid: null
  },
  OtherData: {
    DeviceToken: '',//设备号
    applicationId: '',//用户在该应用中的的ID
    Plat: ''//微信=>1、Android=>2、IOS=>3、XCX=>4
  },
})
