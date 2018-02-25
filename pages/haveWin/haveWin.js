// pages/haveWin/haveWin.js
var PublicUtils = require('../../utils/PublicUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsImg:'',
    haveWinAry:[],
    goodsName:'',
    goodsNum:'',
    goodsPrice:'',
    guessLikeList:[],
    relativeid:''
  },
//点击事件
  //时间戳转化为时间
  fmtDate: function (inputTime) {
    var date = new Date(inputTime * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s
    console.log('-----', Y + M + D + h + m + s); //呀麻碟

  },
//请求事件
  requestGuessLickData: function () {
    var that = this
    var cont = {
      rudder_route: 'VV030077980004000000000000000000000000',
    }
    wx.request({
      method: 'GET',
      // url: 'https://m.meigo.com/api/widgets/890000', //仅为示例，并非真实的接口地址
      url: PublicUtils.realeName + '/api/widgets/890000',
      data: cont,

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!res.data || !res.data.body) {
          return;
        }
        var guessLikeList = res.data.body.contents
        
        console.log('----CIA你喜欢', guessLikeList)
        that.setData({
          guessLikeList: guessLikeList,
          // hiddenloading: true
        })
      }
    })
  },
  requesthaveWinNumData: function () {
    var that = this
    var cont = {
      activityId: that.data.relativeid
    }
    var url =PublicUtils.realeName + '/wechat/prize/getActivitywinner';
    
    PublicUtils.PostAjax(that, "GET", cont, url, function (data) {
      var haveWinItem = data.data.body;
      that.setData({
        goodsImg: haveWinItem.sharePic,

        goodsName: haveWinItem.title,
        goodsNum: haveWinItem.groupNums,
        goodsPrice: Number(haveWinItem.lowPrice).toFixed(2)

      });
      var haveWinAry = haveWinItem.joinPersons;
      for (var i = 0; i < haveWinAry.length; i++) {
        var eachItem = haveWinAry[i];
        var leftTime = that.fmtDate(eachItem.createTime);
        eachItem.haveWinTime = leftTime;
      }
      that.setData({
        haveWinAry: haveWinAry,
        // hiddenloading: true
      })
      console.log('----获奖名单', that.data.goodsName)

    })

  },
  
//系统方法
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that = this;
  var relativeid = options.relativeid;
  console.log('----option', relativeid)
  that.setData({
    relativeid: relativeid,
  });
  that.requesthaveWinNumData();
    // that.requestGuessLickData()
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