// pages/logistics/logistics.js
var PublicUtils = require('../../utils/PublicUtils.js');
var orderUtils = require('../../utils/orderUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    logisticDict:{}
  },
  //获取地址列表接口
  requestLogisticsData: function () {
    var that = this;
    //加载框
    that.setData({
      hiddenloading: false
    })
    var cont = {
      orderId: that.data.orderId,
    }
    var url = PublicUtils.realeName + '/member/order/queryLogistic';
    PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
      console.log('----logi---data', data.data.body)
      that.setData({
        hiddenloading: true
      })
      that.obtainLogisticeDict(data.data.body)
    })
  },
  obtainLogisticeDict: function (logisticDict){
    var that = this;
    var logiStatus = orderUtils.obtainLogisticsStatus(logisticDict.status) 
    logisticDict.logiStatus = logiStatus;
    that.setData({
      logisticDict: logisticDict,
    })
    console.log('----lenght', that.data.logisticDict, that.data.logisticDict.history.length)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderId = options.orderId;
    orderId=171214113557159
    that.setData({
      orderId: orderId
    })
    that.requestLogisticsData()
    console.log('----物流--', orderId)

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})