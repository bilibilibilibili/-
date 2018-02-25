// pages/myOrder/myOrder.js
var PublicUtils = require('../../utils/PublicUtils.js');
var orderUtils = require('../../utils/orderUtils.js');//obtainOrderStatus
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    orderList: [],
    nodata: true,
    // lastPage: '',
    // page: 1,
    maxPage: '',
    pageNum: 1,
    showId: 0,
    showBg: true,
    PageSize: 10,
    onoff: true,
    orderIext: '',
    loadingshow: true,
  },
  //头部点击事件
  orderChange: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    if (that.data.showId == id) {
      return;
    }
    that.setData({
      showId: e.currentTarget.dataset.id,
      orderList: [],
      nodata: true,
      maxPage: '',
      pageNum: 1
    })
    that.requestMyOrderListData()
    console.log('------id---',id)
    // that.getList();
  },
  //去逛逛点击事件
  goBuyingDidClick:function(){
    wx.switchTab({
      url: '../special/special',
})
  },
  //我的订单条目点击事件
  orderItemDidClick:function(e){
    var orderId = e.currentTarget.dataset.orderid;
    var isActivityOrder = e.currentTarget.dataset.activeorder;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderId=' + orderId + "&isActivityOrder =" + isActivityOrder,
     
    })
  },
  //订单option点击事件
  orderOptionDidClick:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    var optionId = e.currentTarget.dataset.optionid;
    var optiontext = e.currentTarget.dataset.optiontext;
    var text=""
    var url = ""
    if (optionId == 1){
      text = '是否删除订单？';
      url = PublicUtils.realeName + '/member/deleteOrder';
    } else if (optionId == 3){
      text = '是否确定收货？';
      url = PublicUtils.realeName + '/member/order/confirmReceive';
    } else if (optionId == 5) {
      text = '是否取消订单？';
      url = PublicUtils.realeName + '/member/cancelOrder';
    } else if (optionId == 2) {
      //查看物流
      wx.navigateTo({
        url: '../logistics/logistics?orderId=' + orderId,
        
      })
    } else if (optionId == 4) {
      //去支付
      // wx.navigateTo({
      //   url: '../payment/payment?relativeId=' + that.data.relativeId + '&groupId=' + that.data.groupId + '&type= ' + 'chou',
      // })
    }
    if (optionId != 4 && optionId != 2) {
      var cont = {
        orderId:orderId
      }
      PublicUtils.showModelFun(text, true, function (res) {
        if (res.confirm) {
          console.log('---点击确定')
          PublicUtils.UserPostAjax(that, "POST", cont, url, function (data) {
//---请求数据
            that.requestMyOrderListData()
          })
          
        }
      });
    }
    // that.setData({
    //   orderIext: text
    // });
    console.log('----liebiao------', orderId, optionId, optiontext)
  },
  //加载假数据
  loadFackData: function () {
    var tabList = [
      {
        "TypeText": "全部",
        "TypeCode": "0",
      },
      {
        "TypeText": "待付款",
        "TypeCode": "5",
      },
      {
        "TypeText": "待发货",
        "TypeCode": "2",
      },
      {
        "TypeText": "待收货",
        "TypeCode": "3",
      },


    ]
    this.setData({
      tabList: tabList
    })

    
    // this.setData({
    //   orderList: orderList
    // })
    // this.tabList = tabList
  },

  obtainMyOrderList:function(orderList){
    for (var i = 0; i < orderList.length; i++) {
      var orderItem = orderList[i];
      var everyOrder = orderItem.orders[0];
      var statusStr = orderUtils.obtainOrderStatus(everyOrder.status)
      // var optionAry = orderUtils.obtainOrderOptionAry(everyOrder.status, everyOrder.isActivityOrder)
      var optionAry = orderUtils.obtainOrderOptionAry(everyOrder.status, everyOrder.isActivityOrder)
      everyOrder.statusStr = statusStr
      everyOrder.optionAry = optionAry;
      everyOrder.toPrice = Number(everyOrder.totalPrice).toFixed(2)
      var goodsItem = orderItem.orders[0].goods[0];
      goodsItem.singleP = Number(goodsItem.price).toFixed(2);
      // goodsItem.
      // var test1 = arr[i].split('src="');
      // var test2 = test1[1].split('"');
      // arrImg.push(test2[0]);
    }
    this.setData({
      // orderList: orderList
      orderList: this.data.orderList.concat(orderList)
    })
    
    console.log('---------thi', this.data.orderList)
  },

  //
  //获取地址列表接口
  requestMyOrderListData: function () {
    var that = this;
    //加载框
    that.setData({
      hiddenloading: false
    })
    var cont = {
      rudder_route: 'VV030077980004000000000000000000000000',
      pageSize: that.data.PageSize,
      page: that.data.pageNum,
      status: that.data.showId
    }
    var url = PublicUtils.realeName + '/member/order/getUnpaidList';
    PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
      console.log('-------data', data.data.body)
      var itemList = data.data.body;
      var resultData = (itemList.length == 0 && that.data.pageNum == 1) ? false : true;
      that.setData({
        nodata: resultData,
        hiddenloading: true
      })

      if (itemList.length < 10) {
        that.setData({
          maxPage: that.data.pageNum
        })
      }
      that.obtainMyOrderList(itemList)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadFackData()
    //isActivityOrder  == 0 再次购买
    this.requestMyOrderListData()
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
    // console.log("bottom", this.data.maxPage, this.data.pageNum, this.data.maxPage)
    if (!this.data.hiddenloading) {
      return
    } else {
      if (this.data.maxPage != '' && this.data.maxPage <= this.data.pageNum) {
        // console.log('```````return')
        return;
      } else {
        this.data.pageNum += 1;
        console.log('=====page++')
        this.requestMyOrderListData()

      }
    }
    
  },
loadOrderListL:function(){
  var orderList = [
    {
      "addTime": "2017-12-11 21:01:33",
      "groupOrderId": "0",
      "orders": [
        {
          "activityType": 1,
          "activityUrl": "",
          "addTime": "2017-12-11 21:01:33",
          "createtime": "2017-12-11 21:01:33",
          "feeDesc": "",
          "orderId": "2074375",
          "status": 2,//订单状态
          "source": "weixin_prize",
          "goodsPrice": "0.100",//总价
          "totalPrice": "0.100",//小计
          "isActivityOrder": 0,
          "goods": [
            {
              "activityUrl": "http://m.meigo.com/pin/detail.html?pinId=&groupId=",
              "cat_id": "173",
              "item_id": "3231136",
              "name": "iPhone X 64GB 银色",
              "price": "0.010",
              "productId": "33792",
              "quantity": "1",//数量
              "source": "weixin_prize",
              "spec": "64GB 银色",//规格
              "subTotal": "0.010",
              "thumbnailPic": "http://img01.rbyair.com/64/1d/62/92de290eb75f477d828d3889545540267d1.jpg"

            }
          ]

        },
      ]
    },
    {
      "addTime": "2017-12-11 21:01:33",
      "groupOrderId": "0",
      "orders": [
        {
          "activityType": 1,
          "activityUrl": "",
          "addTime": "2017-12-11 21:01:33",
          "createtime": "2017-12-11 21:01:33",
          "feeDesc": "",
          "orderId": "2074376",
          "status": 3,//订单状态
          "source": "weixin_prize",
          "goodsPrice": "0.100",//总价
          "totalPrice": "0.100",//小计
          "isActivityOrder": 0,
          "goods": [
            {
              "activityUrl": "http://m.meigo.com/pin/detail.html?pinId=&groupId=",
              "cat_id": "173",
              "item_id": "3231136",
              "name": "全网最低价格,橙子的价格是140g,新鲜的水果啊,全网最低价格,橙子的价格是140g,新鲜的水果啊",
              "price": "0.010",
              "productId": "33792",
              "quantity": "1",//数量
              "source": "weixin_prize",
              "spec": "64GB 银色",//规格
              "subTotal": "0.010",
              "thumbnailPic": "http://img01.rbyair.com/64/1d/62/92de290eb75f477d828d3889545540267d1.jpg"

            }
          ]

        },
      ]
    },
    {
      "addTime": "2017-12-11 21:01:33",
      "groupOrderId": "0",
      "orders": [
        {
          "activityType": 1,
          "activityUrl": "",
          "addTime": "2017-12-11 21:01:33",
          "createtime": "2017-12-11 21:01:33",
          "feeDesc": "",
          "orderId": "2074377",
          "status": 4,//订单状态
          "source": "weixin_prize",
          "goodsPrice": "0.100",//总价
          "totalPrice": "0.100",//小计
          "isActivityOrder": 0,
          "goods": [
            {
              "activityUrl": "http://m.meigo.com/pin/detail.html?pinId=&groupId=",
              "cat_id": "173",
              "item_id": "3231136",
              "name": "iPhone X 64GB 银色",
              "price": "0.010",
              "productId": "33792",
              "quantity": "1",//数量
              "source": "weixin_prize",
              "spec": "64GB 银色",//规格
              "subTotal": "0.010",
              "thumbnailPic": "http://img01.rbyair.com/64/1d/62/92de290eb75f477d828d3889545540267d1.jpg"

            }
          ]

        },
      ]
    },
    {
      "addTime": "2017-12-11 21:01:33",
      "groupOrderId": "0",
      "orders": [
        {
          "activityType": 1,
          "activityUrl": "",
          "addTime": "2017-12-11 21:01:33",
          "createtime": "2017-12-11 21:01:33",
          "feeDesc": "",
          "orderId": "2074378",
          "status": 5,//订单状态
          "source": "weixin_prize",
          "goodsPrice": "0.100",//总价
          "totalPrice": "0.100",//小计
          "isActivityOrder": 0,
          "goods": [
            {
              "activityUrl": "http://m.meigo.com/pin/detail.html?pinId=&groupId=",
              "cat_id": "173",
              "item_id": "3231136",
              "name": "全网最低价格,橙子的价格是140g,新鲜的水果啊,全网最低价格,橙子的价格是140g,新鲜的水果啊",
              "price": "0.010",
              "productId": "33792",
              "quantity": "1",//数量
              "source": "weixin_prize",
              "spec": "64GB 银色",//规格
              "subTotal": "0.010",
              "thumbnailPic": "http://img01.rbyair.com/64/1d/62/92de290eb75f477d828d3889545540267d1.jpg"

            }
          ]

        },
      ]
    },
    {
      "addTime": "2017-12-11 21:01:33",
      "groupOrderId": "0",
      "orders": [
        {
          "activityType": 1,
          "activityUrl": "",
          "addTime": "2017-12-11 21:01:33",
          "createtime": "2017-12-11 21:01:33",
          "feeDesc": "",
          "orderId": "2074379",
          "status": 6,//订单状态
          "source": "weixin_prize",
          "goodsPrice": "0.100",//总价
          "totalPrice": "0.100",//小计
          "isActivityOrder": 0,
          "goods": [
            {
              "activityUrl": "http://m.meigo.com/pin/detail.html?pinId=&groupId=",
              "cat_id": "173",
              "item_id": "3231136",
              "name": "iPhone X 64GB 银色",
              "price": "0.010",
              "productId": "33792",
              "quantity": "1",//数量
              "source": "weixin_prize",
              "spec": "64GB 银色",//规格
              "subTotal": "0.010",
              "thumbnailPic": "http://img01.rbyair.com/64/1d/62/92de290eb75f477d828d3889545540267d1.jpg"

            }
          ]

        },
      ]
    },

  ]
  this.obtainMyOrderList(orderList)
},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})