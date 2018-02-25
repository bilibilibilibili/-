// pages/special/special.js
var Http = require('../../utils/NetWorkingManager.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataSource:[],
    topItemClass:'mg-flex mg-flex-c mg-bg-c-fff mg-small-mt mg-middle-pb',
    itemClass:'mg-flex mg-flex-c mg-bg-c-fff mg-middle-mt mg-middle-pb'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startPullDownRefresh()
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

  requestData:function() {
    let that = this;
    let dataArray = [];
    Http.get('/api/npages/900195',{} , (response) => {
      var responseData = response.data.body.widgets;
      for(let i = 0; i<responseData.length; i++){
        let itemObj = responseData[i];
        for (let j = 0; j < itemObj.contents.length; j++){
          let item = itemObj.contents[j];
          dataArray.push(item);
        }
      }
      that.setData({
        dataSource: dataArray
      })
      wx.stopPullDownRefresh()
    }, function(error){
      wx.stopPullDownRefresh()
    });
  },

  goToDetail:function(event){
    //TODO
    console.log(1);
    let data = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: "../groupDetail/groupDetail"
    })
  },
  onPullDownRefresh: function (){
    this.requestData();  
  }
  
})