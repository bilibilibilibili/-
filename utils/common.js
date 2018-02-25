var common = {
  checkLogin: function( callback ){
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        callback(res.data);
      },
      fail: function(){
        wx.showModal({
          content: '请允许“美购拼团”获取我的个人头像、昵称等信息',
          cancelText:'拒绝',
          confirmText:'允许',
          success:function( click ){
            if(click.confirm){
              //允许
              wx.openSetting({
                success: function (choice) {
                  wx.getUserInfo({
                    success: function( res ){
                      let userInfo = {
                        nickName: res.userInfo.nickName,
                        avatarUrl: res.userInfo.avatarUrl,
                        gender: res.userInfo.gender,
                        city: res.userInfo.city,
                        province: res.userInfo.province,
                        country: res.userInfo.country
                      }
                      wx.setStorage({
                        key: 'userInfo',
                        data: res.userInfo
                      })
                      callback(userInfo);
                    }
                  })
                }
              })
            }else{
              //拒绝
            }    
          }
        }) 
      }
    })
  }
}

module.exports = common;