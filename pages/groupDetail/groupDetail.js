// pages/groupDetail/groupDetail.js
var Http = require('../../utils/NetWorkingManager.js');
var util = require('../../utils/util.js');
var Public = require('../../utils/PublicUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:{},
    image2:'https://m.meigo.com/activities/images/mini-programs/question.jpg',
    time:'',//倒计时
    timeStart:''//开团时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.requestData();
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
  
  },

  timer:function(st,et){
    

  },
  requestData: function(){
    let that = this;
    Http.get('/api/groups/17680520','', function(res){
      if(res.data.body.joinPersons.lenght>1){
        that.data.image2 = res.data.body.joinPersons[1].avatar;
      }
      that.timer(res.data.body.groupStartTime - res.data.body.endTime);
      that.setData({
        state: res.data.body,
        image2:that.data.image2,
        timeStart: util.formatTime(res.data.body.startTime)
      })
    }, function(error){

    });

  }

  
})