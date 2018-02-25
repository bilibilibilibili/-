// pages/goodsDetail/goodsDetail.js
var PublicUtils = require('../../utils/PublicUtils.js');
var WxParse = require('../../wxParse/wxParse.js');
var requestUtils = require('../../utils/requestUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: '',
    detail: '',
    ItemNumber: 1,
    normal: true,
    cartNum: '',
    ActivityId: '',
    ShopId: '',
    SkuId: '',
    loadingshow: false,
    imgList: [],
    identify: 1,
    shareUserid: '',
    shareUnitid: '',
    //抽奖
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    num: 60,
    imgaeScrollAry: [],
    imageDetailAry: [],
    showLogin: false,
    showBg: false,
    issend: false,
    sendOrder: '发送验证码',
    detailDicti: {},
    upPrice: '',
    lowPrice: '',
    countDown: '',//倒计时
    tick: 0,
    haveDetail: false,//加载详情试图
    guessLikeList: [],
    phone: '',
    code: '',
    windowWidth: '',
    imagewidth: 0,//缩放后的宽  
    imageheight: 0,//缩放后的高 
    showSelectGoods: false,
    timer: null,
    timeer: null,
    fackAry: ['1', "dd", "ddd", "ddd", "dd"],//选择商品假数据
    groupId: "",
    relativeId: '',
    title: "",//分享title
    hasShare: ""
  },
  //----1点击事件
  //1.1分享事件
  shareMyGoods: function () {
    var that = this;
    console.log('分享')
    that.onShareAppMessage()
  },
  //猜你喜欢
  guessLikeCellDidCkick: function (e) {
    var contentId = e.currentTarget.dataset.contentid;
    var item = e.currentTarget.dataset.item;
    console.log('---猜111你喜欢----', item)
  },
  //1.2回到首页
  goHomeClick: function () {
    // wx.redirectTo({
    //   url: '../fightGroup/fightGroup',
    // })
    wx.switchTab({
      url: '../special/special',
    })
  },
  // 弹框消失

  //提醒参团
  remindToFight: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你有一个未成团的商品,邀请好友参团才能大大提高成团率哦~',
      confirmColor: "#e02e24",
      cancelColor: "#666",
      confirmText: '邀请好友',
      cancelText: '关闭',

      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '../wxuserShare/wxuserShare?groupid=' + that.data.groupId + '&activeId=' + that.data.relativeId
          })
          // wx.navigateTo({
          //   // url: '../share/share'
          // })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //选择商品类型弹框关闭按钮点击事件
  selectCloseDidClick: function () {
    var that = this;
    that.setData({
      showBg: false,
      showSelectGoods: false
    })
  },
  //马上抢
  goFightBuy: function () {
    //传递参数
    var that = this;
    wx.navigateTo({
      url: '../payment/payment?relativeId=' + that.data.relativeId + '&groupId=' + that.data.groupId + '&type= ' + 'chou',
    })
  },
  //文本监听事件
  listenContentChange: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id == 1) {
      this.setData({
        phone: e.detail.value
      })
    } else if (id == 2) {
      this.setData({
        code: e.detail.value
      })
    }
  },
  //判断用户是否登录
  obtainWXRequest: function () {
    var that = this;
    var userToken = wx.getStorageSync('userToken');
    console.log('--userToken--', userToken)
    if (userToken != undefined && userToken != null && userToken.length) {

    } else {
      that.setData({
        showLogin: true,
        showBg: true,
      })
    }

  },
  //登录确定按钮
  loginConfrimDidClick: function () {
    if (!/^1[3|4|5|7|8]\d{9}$/.test(this.data.phone || this.data.phone == '')) {
      PublicUtils.showModelFun("请正确输入11位手机号", false)
      return;
    } else if (this.data.code == '') {
      PublicUtils.showModelFun("请正确输入验证码", false)
      return;
    }

    this.requestLoginData()
  },
  //倒计时
  obatainCountDownTime: function (sever, end) {
    var that = this
    timer: setInterval(function () {
      PublicUtils.callBackLeftTimeByTimestamp(that.data.tick + Number(sever), end, function (d, h, m, s) {
        var countDown = d + '天' + h + '时' + m + '分' + s + '秒'
        // console.log('-----detail--时间---', countDown)
        that.setData({
          countDown: countDown,
          tick: that.data.tick + 1
        })
      })

    }, 1000)
  },
  //倒计时
  //获取验证码
  sendCode: function (e) {
    var that = this;
    if (this.data.issend == true) {
      return;
    }
    if (this.data.phone == '') {
      PublicUtils.showModelFun("请输入手机号", false)
      return;
    } else if (!/^1[3|4|5|7|8]\d{9}$/.test(this.data.phone)) {
      PublicUtils.showModelFun("手机号支持11位的纯数字", false)
      return;
    }
    var content = {
      Phone: this.data.phone
    };
    if (this.data.num != 60) {
      return;
    }
    var that = this;
    that.setData({
      timer: setInterval(function () {
        if (that.data.num == 1 && that.data.name != '') {
          clearInterval(that.data.timer);
          that.setData({
            num: 60,
            sendOrder: '重新发送',
            issend: false
          })
        } else if (that.data.num == 1 && that.data.name == '') {
          clearInterval(that.data.timer);
          that.setData({
            num: 60,
            sendOrder: '获取验证码',
            issend: true
          })
        } else {
          that.setData({
            num: that.data.num - 1,
            sendOrder: that.data.num - 1 + 's重新发送',
            issend: true
          })
        }
      }, 1000)
    })
    // http://m.meigooo.com/wechat/mini/sendVcode
    var cont = {

      phone: this.data.phone,
    }
    var url = PublicUtils.realeName + '/wechat/mini/sendVcode';
    PublicUtils.PostAjax(that, "GET", cont, url, function (data) {

      console.log('----发送验证码---', data)
    })

  },

  //----2请求事件
  //登录接口
  requestLoginData: function () {
    var that = this;
    console.log('denglu')
    var openid = wx.getStorageSync('openid');
    // http://m.meigooo.com/wechat/mini/bindMember?phone={}&vcode={}&openid={}
    var cont = {
      phone: this.data.phone,
      vcode: that.data.code,
      openid: openid
    }
    console.log('---cont--', cont)
    var url = PublicUtils.realeName + '/wechat/mini/bindMember';
    PublicUtils.PostAjax(that, "GET", cont, url, function (data) {

      that.setData({
        showLogin: false,
        showBg: false,
      })
      // 
      wx.setStorageSync('userToken', data.data.body.ssid);

      console.log('----denglu---', data)

    })
  },
  //--------_网络封装
  requestFightDetail: function () {
    var that = this;
    var cont = {
      // activityId:294
      activityId: that.data.relativeid
    }
    var url = PublicUtils.realeName + '/wechat/prize/getDetail';
    
    PublicUtils.PostAjax(that, "GET", cont, url, function (data) {
      var detailDic = data.data.body;
      console.log('----商品详情----', detailDic)
      var groupId = detailDic.groupId != null ? detailDic.groupId : "";

      that.setData({
        relativeId: detailDic.relativeId,
        groupId: "",
        title: detailDic.title
      })
      if (!that.data.countDown.length) {
        that.obatainCountDownTime(detailDic.serverTime, detailDic.endTime)

      }
      var article = '';
      article = detailDic.brief;
      WxParse.wxParse('article', 'html', article, that, 5);
      //详情图片

      var article1 = detailDic.intro;
      WxParse.wxParse('article1', 'html', article1, that, 5);
      var reg = /<img[^>]*>/gi;
      var src = "/(href|src)=([\"|']?)([^\"'>]+.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG))/i";;
      detailDic.intro.match(reg);
      var arr = detailDic.intro.match(reg);
      var useRole = detailDic.userRole;//0
      var actStatus = detailDic.actStatus;//3
      var groupStatus = detailDic.groupStatus;//0
      var arrImg = [];
      if (arr != null) {
        for (var i = 0; i < arr.length; i++) {
          var test1 = arr[i].split('src="');
          var test2 = test1[1].split('"');
          arrImg.push(test2[0]);
        }
      }

      that.setData({
        // detail: dataList.obj,
        // normal: false,
        indicatorDots: (detailDic.mainPic.length <= 1 ? false : true),
        imageDetailAry: arrImg,
        imgaeScrollAry: detailDic.mainPic,
        haveDetail: true
      })
      that.setData({
        detailDicti: detailDic,
        lowPrice: Number(detailDic.lowPrice).toFixed(2),
        upPrice: Number(detailDic.upPrice).toFixed(2),
      });
    })

  },
  //猜你喜欢
  requestGuessLickData: function () {
    var that = this;
    var cont = {
      rudder_route: 'VV030077980004000000000000000000000000',
    }
    var url = PublicUtils.realeName + '/api/widgets/890000';
    requestUtils.requestWXData(that, "JAVA", "GET", cont, url, function (data) {
      console.log('-------huodongdata', data.data.body);
      var itemList = data.data.body.contents;
      that.setData({
        guessLikeList: itemList,
      })
    })
  },

  //----3系统方法
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    // wx.setStorageSync('userToken', "1q2w3e4r5t6y");

    that.setData({
      relativeid: options.relativeid,
    });
    console.log('======detail---onload', options, options.relativeid)
    //获取屏幕宽高  
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        // var windowscale = windowHeight / windowWidth;//屏幕高宽比  
        console.log('windowWidth: ' + windowWidth)
        console.log('windowHeight: ' + windowHeight)
        that.setData({
          windowWidth: windowWidth
        })
      }
    })
    that.requestFightDetail();
    that.obtainWXRequest();
    // that.remindToFight()
    that.requestGuessLickData()

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
    var that = this;
    console.log('-----osnjow------')
    var showHasShare = wx.getStorageSync('showHasShare');
    console.log('------hasShare----', showHasShare)
    // if (showHasShare == 11){
    //   that.remindToFight()
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('-----hide')
    var that = this;
    this.setData({
      timer: null,
    })
    clearInterval(that.data.timer);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('-----onUnload')
    var that = this;
    that.setData({
      timer: null
    })
    clearInterval(that.data.timer);
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
  onShareAppMessage: function (res) {
    console.log('-----th', this.data.title)
    return {
      title: this.data.title,
      // relativeid: options.relativeid,
      path: 'pages/goodsDetail/goodsDetail?relativeid=' + this.data.relativeid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})