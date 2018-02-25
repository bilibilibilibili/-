// pages/fightGroup/fightGroup.js
var PublicUtils = require('../../utils/PublicUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupAry: [],
    pageNum: 1,
    maxPage: '',
    PageSize: 10,
    hiddenloading: false,
    nodate: false,
    isLast: false,
    haveWinAry: [],
    haveWinPage: 1,
    haveMaxPage: '',
    ishavaLast: false,
    haveNodate: false,
    guessLikeList: [],
    tick: 0,
    timeStr: '',
    wxTimerList: {}
  },
  //1------点击事件
  
  //1.1去开团,中奖名单按钮点击事件
  goMyFightHaveWin: function (e) {
    var that = this;
    var relativeid = e.currentTarget.dataset.relativeid;
    var clickid = e.currentTarget.dataset.clickid;
    if (clickid == 1) {
      wx.navigateTo({
        url: '../goodsDetail/goodsDetail?relativeid=' + e.currentTarget.dataset.relativeid,
      })
    } else if (clickid == 2) {
      wx.navigateTo({
        url: '../haveWin/haveWin?relativeid=' + relativeid,
      })
    }
  },
  //猜你喜欢
  guessLikeCellDidCkick:function(e){
    var contentId = e.currentTarget.dataset.contentid;
    var item = e.currentTarget.dataset.item;
    console.log('---猜111你喜欢----', item)
  },
  //去我的订单页面
  goMyorderView: function () {
    wx.navigateTo({
      url: '../order/order',
    })
  },
  //获取剩余时间
  obtainLeftTimeByTimestamp: function (timestamp, endtime) {
    var that = this;
    var timeStr = '';  // 最后得到的时间字符串 格式 xx时xx分
    var timeDiffer = endtime - timestamp;
    if (timeDiffer <= 0) {
      return;
    } else if (timeDiffer > 86400) {
      // 大于一天
      var nD = Math.floor(timeDiffer / (60 * 60 * 24));
      timeStr = nD + '天'
    } else {
      //======华丽分分割线
      var timeStr = this.obtainFightLeftTimeByTimestamp(timestamp, endtime)
      // console.log('------retutn----', timeStr)
      var nH = Math.floor(timeDiffer / (60 * 60)) % 24;
      if (nH < 10) {
        nH = '0' + nH
      }
      var nM = Math.floor(timeDiffer / 60) % 60;
      if (nM < 10) {
        nM = '0' + nM
      }
      var nS = timeDiffer - nH * 60 * 60 - nM * 60;
      if (nS < 10) {
        nS = '0' + nS
      }
      timeStr = nH + ':' + nM + ':' + nS
    }
    // console.log('--return------', that.data.timeStr)
    return timeStr
  },
  obtainFightLeftTimeByTimestamp: function (timestamp, endtime) {
    var that = this;
    // console.log('----tick-----', that.data.tick)
    var timeStr = '';  // 最后得到的时间字符串 格式 xx时xx分
    timer: setInterval(function () {
      var timeDiffer = Number(endtime) - that.data.tick - Number(timestamp);
      // console.log('----tick-----', that.data.tick)
      that.setData({
        tick: that.data.tick + 1
      })
      var nH = Math.floor(timeDiffer / (60 * 60)) % 24;
      if (nH < 10) {
        nH = '0' + nH
      }
      var nM = Math.floor(timeDiffer / 60) % 60;
      if (nM < 10) {
        nM = '0' + nM
      }
      var nS = timeDiffer - nH * 60 * 60 - nM * 60;
      if (nS < 10) {
        nS = '0' + nS
      }
      timeStr = nH + ':' + nM + ':' + nS;
      that.setData({
        timeStr: timeStr,
      })

    }, 1000)
    return that.data.timeStr;
  },
  //倒计时
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
    // console.log('----倒计时-', Y + M + D + h + m + s);

  },
  //给对象添加剩余时间属性
  addLeftTimeByTimestamp: function (data) {
    var that = this;
    for (var i = 0; i < data.length; i++) {
      var eachItem = data[i];
      var leftTime = that.obtainLeftTimeByTimestamp(eachItem.timestamp, eachItem.end_time)
      eachItem.leftTime = leftTime;
      eachItem.mktPrice = Number(eachItem.mktPrice).toFixed(2)
      eachItem.upPrice = Number(eachItem.upPrice).toFixed(2)
      eachItem.lowPrice = Number(eachItem.lowPrice).toFixed(2)
    }
    that.setData({
      groupAry: that.data.groupAry.concat(data)
    });

  },

  //请求事件
  //系统自带的事件
  rquestFightGroupData: function () {
    var that = this;
    that.setData({
      hiddenloading: false
    })
    var cont = {
      rudder_route: 'VV030077980004000000000000000000000000',
      page: that.data.pageNum,
      size: that.data.PageSize,
    }
    var url = PublicUtils.realeName + '/wechat/prize/getList';
    PublicUtils.PostAjax(that, "GET", cont, url, function (data) {
      console.log('----封装---', data.data)
      var fightAry = data.data.body;
      var nodate = that.data.pageNum == '1' && fightAry.length == 0 ? true : false
      console.log("-====nodata", nodate)
      that.setData({
        nodata: nodate,
        hiddenloading: true
      })
      if (that.data.nodata) {
        that.setData({
          isLast: true,
        })
        that.requestHaveWinData()
      }

      if (fightAry.length < 10) {
        that.setData({
          maxPage: that.data.pageNum,
          isLast: true
        })
        that.requestHaveWinData()
      }
      that.addLeftTimeByTimestamp(data.data.body)
    })
  },
  //已经中奖
  requestHaveWinData: function () {
    var that = this
    if (that.data.isLast) {
      that.setData({

        hiddenloading: false
      })
    }
    var cont = {
      rudder_route: 'VV030077980004000000000000000000000000',
      page: that.data.haveWinPage,
      size: that.data.PageSize,
      type: 3
    }
    var url = PublicUtils.realeName + '/wechat/prize/getList';
    PublicUtils.PostAjax(that, "GET", cont, url, function (data) {
      var haveWinAry = data.data.body;
      console.log("-====haveWinAry", haveWinAry)

      // var fightAry = res.data.body;
      var haveNodate = that.data.haveWinPage == '1' && haveWinAry.length == 0 ? true : false
      console.log("-====havenodata", haveNodate)
      that.setData({
        haveNodate: haveNodate,
        hiddenloading: true,
        ishavaLast: true,
      })
      for (var i = 0; i < haveWinAry.length; i++) {
        var eachItem = haveWinAry[i];
        var leftTime = that.fmtDate(eachItem.end_time);
        eachItem.haveWinTime = leftTime;
      }
      that.setData({
        haveWinAry: that.data.haveWinAry.concat(haveWinAry),
      })
      if (haveWinAry.length < 10) {
        that.setData({
          haveMaxPage: that.data.haveWinPage,
          ishavaLast: true
        })
      }
      console.log('--------ishavaLast------------', that.data.isLast, that.data.ishavaLast)
    })

  },
  //猜你喜欢
  requestGuessLickData: function () {
    var that = this;
    console.log('-isLast---', that.data.isLast, that.data.ishavaLast)
    var cont = {
      rudder_route: 'VV030077980004000000000000000000000000',
    }
    wx.request({
      method: 'GET',
      url: PublicUtils.realeName + '/api/widgets/890000',
      data: cont,

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!res.data || !res.data.body) {

          return;
        }
        // console.log('----CIA你喜欢', res.data.body)
        var guessLikeList = res.data.body.contents

        console.log('----CIA你喜欢', guessLikeList)
        that.setData({
          guessLikeList: guessLikeList,
          // hiddenloading: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('onload')
    that.rquestFightGroupData();
    // that.requestHaveWinData();
    that.requestGuessLickData();//猜你喜欢
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
  // onPullDownRefresh: function () {
  //   wx.stopPullDownRefresh() //停止下拉刷新
  //   this.setData({
  //     pageNum: 1,
  //     maxPage: ''
  //   })
  //   this.rquestFightGroupData();
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isLast) {
      if (this.data.maxPage != '' && this.data.maxPage <= this.data.pageNum) {
        return;
      } else {
        this.setData({
          pageNum: this.data.pageNum + 1
        })
        this.rquestFightGroupData()
      }
    }
    // else if (this.data.isLast && !this.data.ishavaLast){
    //   //中奖名单
    //   if (this.data.haveMaxPage != '' && this.data.haveMaxPage <= this.data.haveWinPage) {
    //     console.log('---return')
    //     // console.log('--haveWinPage-maxreturn---', this.data.haveMaxPage, 'page', this.data.haveWinPage);
    //     return;
    //   } else {
    //     console.log('+++haveWinPagemax+++', this.data.haveMaxPage, 'page', this.data.haveWinPage);
    //     this.setData({
    //       haveWinPage: this.data.haveWinPage + 1
    //     })
    //     console.log('+++max+setData++', this.data.haveMaxPage, 'page', this.data.haveWinPage);
    //     // this.loadData();
    //     this.requestHaveWinData()
    //   }
    // } 
    else if (this.data.isLast && this.data.ishavaLast) {
      //猜你喜欢
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   //你好啊
  }
})