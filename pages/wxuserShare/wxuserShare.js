// pages/share/share.js
var PublicUtils = require('../../utils/PublicUtils.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //根据状态判断显示界面:
    activeStatus: "5",//1---团长 2--别人看到的 3--完成开团 4--失败
    arrayNum: '',
    showExplain: false,
    showBg: false,
    tick: 0,
    countDownn: '',
    isOut: false,
    timer: null,
    activeid: '',
    groupID: "",
    detailDicti: {},
    lowPrice: "",
    upPrice: '',
    groupNums: '',//几人团
    economical: "",
    activeEnd: "",
    title: "",
    hasShare:0,
    emptyImagAry: ["1", "1", "1", "1", "1", "1", "1"],
    phone: '',
    code: '',
    showLogin: false,
    issend: false,
    sendOrder: '发送验证码',
    num: 60,
    groupStatus: "",
    userRole: ""

  },
  //点击事件
  //关闭弹窗事件
  closePopup: function () {
    var that = this;
    that.setData({
      showExplain: false,
      showBg: false,
    })
    if (that.data.isOut) {
      that.setData({
        isOut: false,
      })
    }
  },
  //---别人打开,跳转支付界面
  fightGoodsNowClick: function () {
    var that = this;
    console.log('----支付---')
    wx.navigateTo({
      url: '../payment/payment?relativeId=' + that.data.activeid + "&groupId=" + that.data.groupID + '&type= ' + 'chou' + '&join=' + 'join',
      // url: '../payment/payment?relativeId=' + that.data.relativeId + '&groupId=' + that.data.groupId + '&type= ' + 'chou',
    })
  },
  //分享点击事件
  shareMyGoods: function () {
    var that = this;
    that.onShareAppMessage()
    console.log('分享')
  },
  //拼单成功界面再次拼单
  fightAgain: function () {
    // wx.navigateTo({
    //   url: '../fightGroup/fightGroup'
    // })
    wx.switchTab({
      url: '../special/special',
    })
  },
  //拼团不成功的-0.01元抢好货
  fightNowClick: function () {
    console.log('---shouye')
    // wx.navigateTo({
    //   url: '../fightGroup/fightGroup'
    // })
    wx.switchTab({
      url: '../special/special',
    })
  },
  //role界面-点击商品名称   ---
  roleTranslateToGoodsDetail: function () {
    var that = this;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?relativeid=' + that.data.activeid + "&groupID=" + that.data.groupID,
    })
  },
  //拼单成功点击详情
  SuccessTranslateToGoodsDetail: function () {
    var that = this;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?relativeid=' + that.data.activeid + "&groupID=" + that.data.groupID,
    })
  },
  //拼单须知
  fightGroupExplain: function () {
    var that = this;
    that.setData({
      showExplain: true,
      showBg: true,
    })
  },
  //倒计时
  obatainCountDownTime: function (sever, end) {
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
  removeLabel: function (str) {
    str = str.replace("-", "");
    return str;
  },
  fmtDate: function (inputTime) {
    var date = new Date(inputTime * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    h = this.checkTime(h) + ':';
    m = this.checkTime(m) + ':';
    s = this.checkTime(s)
    return Y + M + D + h + m + s
  },
  checkTime: function (i) { //时分秒为个位，用0补齐
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  //数据请求
  requestTeamFightData: function () {
    var that = this;
    var cont = {
      activityId: that.data.activeid,
      groupId: that.data.groupID
    }
    console.log('---------con', cont)
    var url = PublicUtils.realeName + '/wechat/prize/getDetail';
    // PostGetUserAjax
    PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
      var detailDic = data.data.body;
      console.log('----商品详情----', detailDic)
      var groupNums = Number(detailDic.groupNums);
      if (detailDic.actEndTime) {
        var activeEnd = that.fmtDate(detailDic.actEndTime);
        that.setData({
          activeEnd: activeEnd,
        })
      }
      var joinPersons = detailDic.joinPersons;
      that.setData({
        emptyImagAry: joinPersons,
        title: detailDic.title
      })
      var missingNum = detailDic.missingNum;
      // missingNum = 3
      that.creatImgAry(missingNum)
      that.setData({
        detailDicti: detailDic,
        lowPrice: Number(detailDic.lowPrice).toFixed(2),
        upPrice: Number(detailDic.upPrice).toFixed(2),
        economical: Number(detailDic.upPrice).toFixed(2) - Number(detailDic.lowPrice).toFixed(2)
      });
      if (!that.data.countDownn.length) {
        that.obatainCountDownTime(detailDic.serverTime, detailDic.endTime)
      }

      var article = '';
      article = detailDic.brief;
      WxParse.wxParse('article', 'html', article, that, 5);
      //详情图片
      var article1 = detailDic.intro;
      WxParse.wxParse('article1', 'html', article1, that, 5);
      var userRole = detailDic.userRole;//0
      var actStatus = detailDic.actStatus;//3
      var groupStatus = detailDic.groupStatus;//0
      var actStatus = detailDic.actStatus
      that.setData({
        groupStatus: groupStatus,
        userRole: userRole,
      });
      that.obtianGroupStatus(userRole, groupStatus, actStatus)

      //根据角色判断
      // 用户角色userRole，非团员0、团长1、团员2
      // 活动状态actStatus，未开始0、已开始1、已结束2、已售罄3
      // 开团状态groupStatus，未开团0、组团中（开团成功、参团成功）1、组团成功2、组团失败3'

    })
  },
  obtianGroupStatus: function (userRole, groupStatus, actStatus) {
    var that = this;
    //  userRole == 2 && groupStatus == 1
    if ((userRole == 1 && groupStatus == 1) || (userRole == 2 && groupStatus == 1)) {
      that.setData({
        activeStatus: 1
      })
    } else if (userRole == 0 && groupStatus == 1) {
      that.setData({
        activeStatus: 2
      })
    } else if ((userRole == 1 && groupStatus == 2) || (userRole == 2 && groupStatus == 2)) {
      that.setData({
        activeStatus: 3
      })
    } else if (groupStatus == 3) {
      that.setData({
        activeStatus: 4
      })
    } else if ((userRole == 0 && groupStatus == 2) || actStatus == 2) {
      that.setData({
        activeStatus: 5
      })
    }
    else {
      that.setData({
        activeStatus: 6
      })
    }
  },
  //把字符串true转为bool 
  changeStrToBoole: function (joinPerson) {
    var that = this;
    for (var i = 0; i < joinPerson.length; i++) {
      var item = joinPerson[i];
      if (item.is_open == "true") {
        item.is_open = true;
      }
      that.setData({
        emptyImagAry: joinPerson
      })
      // console.log('---change----', that.data.emptyImagAry)
    }
  },
  //创建空头像数组
  creatImgAry: function (num) {
    var that = this;
    // var imageAry = []
    for (var i = 0; i < num; i++) {
      var count = { "jj": "jj" }

      that.data.emptyImagAry.push(count)
    }
    that.setData({
      emptyImagAry: that.data.emptyImagAry
    })

    // console.log('--emptyImagAry----', that.data.emptyImagAry);
    that.changeStrToBoole(that.data.emptyImagAry)
  },

  //系统方法
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      activeid: options.activeId,
      groupID: options.groupid,
    })
    // that.setData({
    //   activeid: 364,
    //   groupID: 2068404,
    // })
    // console.log('--options----', options)
    if (options.file == "share") {
      that.setData({
        activeid: options.shareActiveID,
        groupID: options.shreaGroup,
      })
    }
    if (options.isOut == 1) {
      that.setData({
        isOut: true,
        showBg: true,
      })
    }
    // if (userToken != undefined && userToken != null && userToken.length) {
    //   // that.setData({
    //   //   relativeId: options.relativeId,
    //   //   groupId: options.groupId
    //   // })
    //   // that.requestPayMentData()
    //   that.requestTeamFightData()
    // } else {
    //   that.setData({
    //     showLogin: true,
    //     showBg: true,
    //     // relativeId: options.relativeId,
    //     // groupId: options.groupId
    //   })
    // }

    // if (options.isOut==1){
    //   that.setData({
    //     isOut: true,
    //     showBg: true,
    //   })
    // }

    // url: '../wxuserShare/wxuserShare?groupid=' + that.data.groupId + '&activeId=' + that.data.relativeId + "&isOut=" + 1
    // that.requestTeamFightData()

    // wx.showShareMenu({
    //   withShareTicket: true,
    //   success: function (res) {
    //     // 分享成功
    //     console.log('shareMenu share success')
    //     console.log('分享' + res)
    //   },
    //   fail: function (res) {
    //     // 分享失败
    //     console.log(res)
    //   }
    // })
    // wx.showShareMenu({
    //   withShareTicket: true
    // })

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
  //获取验证码
  sendCode: function (e) {
    var that = this;
    console.log('0000', this.data.issend)
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

      that.requestTeamFightData()
      console.log('----denglu---', data)

    })
  },
  requestShareSuccessData: function () {
    var that = this;
    if (that.data.groupStatus == 1 && that.data.userRole > 0) {
      if (that.data.activeid) {
        var cont = {
          chouId: that.data.activeid,
        }
        var url = PublicUtils.realeName + '/member/shareGroup';
        PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
          console.log('----succc---data', data)

        })
      }

    }


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
    var userToken = wx.getStorageSync('userToken');
    console.log('--userToken--', userToken)
    var that = this;
    if (userToken != undefined && userToken != null && userToken.length) {
      // that.setData({
      //   relativeId: options.relativeId,
      //   groupId: options.groupId
      // })
      // that.requestPayMentData()
      // this.setData({
      //   countDownn: "",
      // })
      that.requestTeamFightData()
    } else {
      that.setData({
        showLogin: true,
        showBg: true,
        // relativeId: options.relativeId,
        // groupId: options.groupId
      })
    }
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
    // var hasShare = wx.setStorageSync('hasShare', this.data.hasShare);
    if (this.data.userRole != 0 && this.data.groupStatus == 1 && this.data.hasShare == 0) {
      wx.setStorageSync('showHasShare',"11");
    } else {
      wx.setStorageSync('showHasShare',"00");
    }
    console.log('----unload---', wx.getStorageSync('showHasShare'))
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
    // console.log(options.webViewUrl)
    console.log('-----th', this.data.title)
    var that = this;

    // console.log('-----------------fenxiang', that.data.activeid, that.data.groupID)
    return {
      title: this.data.title,
      path: 'pages/wxuserShare/wxuserShare?file=' + "share" + "&shareActiveID=" + that.data.activeid + '&shreaGroup= ' + that.data.groupID,
      success: function (res) {
        console.log('-------succc---', res)
        that.setData({
          hasShare:1
        })
        that.requestShareSuccessData()
        //
        // if (res.shareTickets !=undefined){
        //   console.log(res.shareTickets[0])
        //   console.log('-------转发到群---')

        // }else {
        //   console.log('---------转发到个人------')
        // }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})