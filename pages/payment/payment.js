// pages/payment/payment.js
var PublicUtils = require('../../utils/PublicUtils.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: {},
    addressData: {},
    hiddenloading: true,
    relativeId: '',
    groupId: "",
    // noAddressRemindStr:'去添加地址喽',
    haveAddress: true,
    addressId: '',
    bodyData: {},
    defaultAddress: {},//默认地址
    goodsInfor: {},//商品信息
    price: '',
    total: {},
    totalPrice: '',
    showPay: true,
    arrayNum: '',
    showExplain: false,
    // showBg:false,
    tick: 0,
    countDownn: '',
    showBg: false,
    isOut: true,
    timer: null,
    activeid: '',
    // groupID: "",
    detailDicti: {},
    lowPrice: "",
    upPrice: '',
    groupNums: '',//几人团
    // shareCover:true,
    emptyImagAry: ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    title:'',//分享的头部
    phone: '',
    code: '',
    showLogin: false,
    issend: false,
    sendOrder: '发送验证码',
    num: 60,
    join:""
    // showBg: false,

  },
  //支付点击事件
  WXPayDidClick: function () {
    var that = this;
   
    var consigneeId = that.data.defaultAddress.consigneeId
    console.log('-----defaultAddress-', consigneeId)
    if (consigneeId) {
      that.setData({
        hiddenloading: false
      })
      var cont = "activityId=" + that.data.relativeId + "&groupId=" + that.data.groupId + "&addressId=" + consigneeId;
      var url = PublicUtils.realeName + '/wechat/prize/openGroup';
      if (that.data.join == "join"){
        url = PublicUtils.realeName + '/wechat/prize/joinGroup';
      }
      
      PublicUtils.UserPostAjax(that, "POST", cont, url, function (data) {
        console.log('----WZF-', data)
        that.setData({
          hiddenloading: true
        })
        var orderID = data.body;
        that.requestWXSubmitData(orderID)
      })
    } else {
      that.remindToSubmitAddress()
    }
  },
  //提交orderid获取微信支付凭证
  requestWXSubmitData: function (orderId) {
    var that = this;
    that.setData({
      hiddenloading: false
    })
    var cont = {
      orderId: orderId,
    }
    var url = PublicUtils.realeName + '/wechat/prize/getWechatParameters';
    PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
      console.log('----opendata-', data);
      that.setData({
        hiddenloading: true
      })
      var WXData = data.data.body;
      wx.requestPayment({
        'timeStamp': WXData.timeStamp,
        'nonceStr': WXData.nonceStr,
        'package': WXData.package,
        'signType': 'MD5',
        'paySign': WXData.paySign,
        'success': function (res) {

          var groupid = data.data.body.groupId;
          console.log('-----weixini-', groupid)
          that.setData({
            groupId: groupid
          })
          wx.redirectTo({
            url: '../wxuserShare/wxuserShare?groupid=' + that.data.groupId + '&activeId=' + that.data.relativeId + "&isOut=" + 1
          })
          
        },
        'fail': function (res) {
        }
      })
    })
  },
  //收货地址为空
  remindToSubmitAddress: function () {
    wx.showModal({
      title: '提示',
      content: '收货地址不能为空',
      confirmColor: "#e02e24",
      cancelColor: "#666",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.navigateTo({
            // url: '../address/address?relativeid=' + e.currentTarget.dataset.relativeid,
            url: '../address/address'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //选择地址
  selectAddressDidClick: function () {
    // url: '../address/address?selectCell=' + 1 + '&buserId=' + this.data.buserID
    wx.navigateTo({
      url: '../address/address?selectCell=' + 1,
    })
  },

  //初始化地址信息
  renderAddressData: function (addressList) {
    var that = this;
    if (addressList) {
      if (addressList.length > 0) {
        for (var i = 0; i < addressList.length; i++) {
          var addressItem = addressList[i];
          var isDefault = addressItem.isDefault;
          if (isDefault == 1) {
            // 默认地址
            this.setData({
              defaultAddress: addressItem
            })
            console.log('----------default', this.data.defaultAddress)
          }
        }
      }
      // else {
      //   //跳转添加地址
      //     wx.navigateTo({
      //       url: '../address/editAddress/editAddress?haveaddress=' + 1,
      //     })
      // }

    }
    // else {
    //    //跳转添加地址
    //   wx.navigateTo({
    //     url: '../address/editAddress/editAddress?haveaddress=' + 1,
    //   })
    // }
    var consigneeId = that.data.defaultAddress.consigneeId
    console.log('-----defaultAddress-', consigneeId)
    if (consigneeId) {

    } else {
      wx.navigateTo({
        url: '../address/editAddress/editAddress?haveaddress=' + 1,
      })
    }
    // console.log('----99999999999999999-------')
    //姓名  consigneeName  电话 consigneeTel  addrType:1(家庭) address:漕河泾开发区  .province.regionName省 .city.regionName市.district.regionName区
  },
  renderGoodsInformation: function (goodsList) {
    var that = this;
    if (goodsList) {
      var goodsItem = goodsList[0];

      that.setData({
        goodsInfor: goodsItem,
        price: Number(goodsItem.price).toFixed(2)
      })
      console.log('------goodsInfor', that.data.goodsInfor)
    }
    
  },
  //请求数据--支付界面详情数据
  requestPayMentData: function () {
    var that = this;
    
    that.setData({
      hiddenloading: false
    })
    var cont = "addressId=" + "" + "&activityId=" + that.data.relativeId;
    var url = PublicUtils.realeName + '/wechat/prize/getPayDetail';
    PublicUtils.UserPostAjax(that, "POST", cont, url, function (data) {
      console.log('----2222-data---', data)
      var payDetailItem = data.body;
      console.log('-----payDetailItem---', payDetailItem)
      //收货地址
      var consignees = payDetailItem.consignees;
      var goodsAry = payDetailItem.goods;
      that.renderAddressData(consignees)
      that.renderGoodsInformation(goodsAry)
      var totoal = payDetailItem.total;
      var totalPrice = Number(totoal.totalPrice).toFixed(2);

      that.setData({
        total: totoal,
        totalPrice: totalPrice,
        hiddenloading: true
      })

    })
  },

  //----------分享界面
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
  //分享点击事件
  shareMyGoods: function () {
    var that = this;
    that.onShareAppMessage()
    console.log('分享')
  },
  //跳转到商品详情界面
  translateToGoodsDetail: function () {
    wx.navigateBack({
      delta: 1
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
      PublicUtils.callBackLeftTimeByTimestamp(that.data.tick + Number(sever), end, function (d, h, m, s) {
        var countDownn = h + ':' + m + ':' + s
        that.setData({
          countDownn: countDownn,
          tick: that.data.tick + 1
        })
      })

    }, 1000)
  },
  //数据请求
  requestTeamFightData: function () {
    var that = this;
    var cont = {
      activityId: that.data.relativeId,
      groupId: that.data.groupId
    }
    var url = PublicUtils.realeName + '/wechat/prize/getDetail';

    console.log('----url-------', url, cont)
    PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
      var detailDic = data.data.body;
      console.log('----商品详情----', detailDic)
      var groupNums = Number(detailDic.groupNums);

      var joinPersons = detailDic.joinPersons;
      that.setData({
        emptyImagAry: joinPersons,
        title:detailDic.title
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
    console.log('--emptyImagAry----', that.data.emptyImagAry.length);
    that.changeStrToBoole(that.data.emptyImagAry)
  },
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
      console.log('---change----', that.data.emptyImagAry)
    }
  },

  //系统方法
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("---------payment--options-", options)
    var userToken = wx.getStorageSync('userToken');
    console.log('--userToken--', userToken)
    if (userToken != undefined && userToken != null && userToken.length) {
      that.setData({
        relativeId: options.relativeId,
        groupId: options.groupId,
        join: options.join
      })
      that.requestPayMentData()
    } else {
      that.setData({
        showLogin: true,
        showBg: true,
        relativeId: options.relativeId,
        groupId: options.groupId,
        join: options.join
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
    console.log('--------zhifu-----url',url)
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

      that.requestPayMentData()
      console.log('----denglu---', data)

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
    var that = this;
    var addressContent = wx.getStorageSync('editAdderss');

    console.log('----------onshow-----------', addressContent)

    if (addressContent != undefined && addressContent != '' && addressContent != null) {
      addressContent = JSON.parse(addressContent)
      that.setData({
        defaultAddress: addressContent
        //  haveAddress:true,
        //  name: addressContent.Name,
        //  phone: addressContent.Phone,
        //  addressdetail: addressContent.ReceiveAddress,
        //  addressType: addressContent.AddressType,
        //  addressId: addressContent.AddressId,
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