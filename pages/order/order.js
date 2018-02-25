// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // PageOrigin
    // miniprogram
    var that = this;
    var userToken = wx.getStorageSync('userToken');
    var userId = wx.getStorageSync('userId');
    // wx.setStorageSync('userId', res.data.body.userId);
    console.log('--userToken--', userToken)
    // var url = "https://m.meigo.com/member/groups.html?userToken=" + userToken + "&PageOrigin=" + "miniprogram" + "&type=" + 1 + "&userId=" + userId
    var url = "https://m.meigo.com/member/groups.html?userToken=" + userToken + "&PageOrigin=miniprogram" + "&type=" + 1 + "&userId=" + userId
    // var userToken = wx.getStorageSync('userToken');
    // console.log('--userToken--', userToken)
    // var url = "https://m.meigo.com/for_app_test.html?PageOrigin=" + "miniprogram"
    that.setData({
      url: url
    })

    // var url ="http://127.0.0.1:8020/energymasterh5/login.html?__hbt=1512900890225"
    that.setData({
      url: url
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

 
})