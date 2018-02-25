// pages/myCenter/myCenter.js
const statusText = ['我的活动', '待付款', '待发货', '待收货'];
const statusImage = ['https://m.meigo.com/activities/images/mini-programs/member/img_wdhd.png',
  'https://m.meigo.com/activities/images/mini-programs/member/img_dfk.png',
  'https://m.meigo.com/activities/images/mini-programs/member/img_dfh.png',
  'https://m.meigo.com/activities/images/mini-programs/member/img_dsh.png'];
const cellIcon = ['https://m.meigo.com/activities/images/mini-programs/member/location2.png',
                  'https://m.meigo.com/activities/images/mini-programs/service/service.png'];

const cellText = ['收货地址','服务中心'];         
var Http = require('../../utils/NetWorkingManager.js');
var Common = require('../../utils/common.js');
               
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusText: statusText,
    statusImage: statusImage,
    cellIcon:cellIcon,
    cellText: cellText,
    userInfo:{},
    status:[]

  },
  //----1点击事件
  
  //-----2网络请求
  
  //-----3系统方法
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
    this.getStatus();
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

  getRequest: function(){
    let that = this;
   
    Http.get('/member/info/get', {}, function(response){
      
    }, function(error){

    }) 
  },
  // 获取用户信息
  getUserInfo: function(){
    let that = this;
    Common.checkLogin(function( userInfo ){
      if(userInfo){
        that.setData({
          userInfo: userInfo
        })
      }
      
    })
  },
  //获取用户信息
  getStatus: function(){
    let that = this;
    Http.get('/member/order/getStat',{}, function(res){
      let status = res.data.body;
      that.data.status.push(status.activity);
      that.data.status.push(status.noPay);
      that.data.status.push(status.shipNum);
      that.data.status.push(status.receiveNum);
      that.setData({
        status:that.data.status
      });
    }, function(err){

    });
  },
  //我的订单
  myOrder: function(){
    Common.checkLogin(function(userInfo){
      //TODO
      
    })
  },
  //订单状态跳转
  orderStatus: function(event){
    Common.checkLogin(function(userInfo){
      switch (event.currentTarget.dataset.text) {
        case '我的活动':
          //TODO
          break;
        case '待付款':
          //TODO
          break;
        case '待发货':
          //TODO
          break;
        case '待收货':
          //TODO
          break;
        default:
      }
    })
  },
  //cell 跳转
  pushTo: function(event){
    switch (event.currentTarget.dataset.text) {
      case '收货地址':
        Common.checkLogin(function(userInfo){
        //TODO

        })
        break;
      case '服务中心':
        //TODO
        break;
      default:
    }

  }

  


 
  
})