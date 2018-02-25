// pages/share/share.js
var PublicUtils = require('../../utils/PublicUtils.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrayNum:'',
    showExplain:false,
    // showBg:false,
    tick:0,
    countDownn:'',
    showBg: true,
    isOut:true,
    timer:null,
    activeid:'',
    groupID:"",
    detailDicti:{},
    lowPrice:"",
    upPrice: '',
    groupNums:'',//几人团
    // shareCover:true,
    emptyImagAry: ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],

  },
//点击事件
//关闭弹窗事件
  closePopup:function (){
var that = this;
that.setData({
  showExplain: false,
  showBg: false,
})
    if (that.data.isOut){
      that.setData({
        isOut: false,
      })
    }
  },
  //分享点击事件
  shareMyGoods:function(){
    var that = this;
    that.onShareAppMessage()
    console.log('分享')
  },
//跳转到商品详情界面
  translateToGoodsDetail:function(){
    wx.navigateBack({
          delta: 2
        })
  },
//拼单须知
  fightGroupExplain:function(){
    var that = this;
    that.setData({
      showExplain: true,
      showBg: true,
    })
  },
//倒计时
  obatainCountDownTime: function (sever, end) {
    // var tick = 0;
    var that = this
    timer: setInterval(function () {
      // console.log('----timer')
      PublicUtils.callBackLeftTimeByTimestamp(that.data.tick + Number(sever), end, function (d, h, m, s) {
        // console.log('-----cou', d,h,m,s)
        var countDownn = h + ':' + m + ':' + s 
        // var countDownn = that.removeLabel(h) + ':' + that.removeLabel(m) + ':' + that.removeLabel(s) 
        // console.log('-----cou',countDownn)
        that.setData({
          countDownn: countDownn,
          tick: that.data.tick + 1
        })
      })

    }, 1000)
  },
  removeLabel:function(str){
    str = str.replace("-", "");
    return str;
  },
//数据请求
requestTeamFightData:function(){
  var that = this;
  var cont = {
    activityId: that.data.activeid,
    groupid: that.data.groupID
  }
  var url = PublicUtils.realeName + '/wechat/prize/getDetail';

  console.log('----url-------', url,cont)
  PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
    var detailDic = data.data.body;
    console.log('----商品详情----', detailDic)
    var groupNums = Number(detailDic.groupNums);

    var joinPersons = detailDic.joinPersons;
    that.setData({
      emptyImagAry: joinPersons
    })
    var missingNum = detailDic.missingNum;
    that.creatImgAry(missingNum)
    that.setData({
      detailDicti: detailDic,
      lowPrice: Number(detailDic.lowPrice).toFixed(2),
      upPrice: Number(detailDic.upPrice).toFixed(2),
    });
    that.obatainCountDownTime(detailDic.serverTime, detailDic.endTime)
    var article = '';
    article = detailDic.brief;
    WxParse.wxParse('article', 'html', article, that, 5);
    //详情图片
    var article1 = detailDic.intro;
    WxParse.wxParse('article1', 'html', article1, that, 5);
  })
},
//创建空头像数组
creatImgAry:function(num){
  var that = this;
  // var imageAry = []
  for (var i = 0; i < num; i++) {
    var count = { "avatar":"https://m.meigo.com/activities/images/mini-programs/home.jpg"}
    that.data.emptyImagAry.push(count)
  }
  that.setData({
    emptyImagAry: that.data.emptyImagAry
  })
  console.log('--emptyImagAry----',that.data.emptyImagAry.length);
},
//系统方法
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
    
  //  that.setData({
  //    activeid: options.activeId,
  //    groupID: options.groupid,
  //  })
   that.setData({
     activeid: 356,
     groupID: 1925449,
   })
    that.requestTeamFightData()
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