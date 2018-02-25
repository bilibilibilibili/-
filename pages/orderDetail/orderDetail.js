// pages/orderDetail/orderDetail.js
var PublicUtils = require('../../utils/PublicUtils.js');
var orderUtils = require('../../utils/orderUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  orderId:'',
  imagurl:"",//根据订单状态加载图片链接
  defaultAddress:{},
  // goodsDetail:{},
  statusStr:"",
  optionAry:[],
  orderDetail:{},
  msg: "",
  hiddenMsg: true,
  orderPrice:"",
  orderTime:"",//下单时间
  teamType:"",
  goodsimg:"",//商品图片链接
  activeStaus:"",
  teamid:'',
  groupid:"",
  isActivityOrder:""
  //pintuanType   3的时候需要转换
  },
  //剪切
  clipboard:function(e) {
    var clipdata = e.currentTarget.dataset.clipdata;
    var that = this;
    wx.setClipboardData({
      data: clipdata,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            that.showMsg("复制成功")
            console.log(res.data) // data
          }
        })
      }
    })
  },
  //弹框自动消失
  showMsg:function (msg) {
    var that = this;
    that.setData({
      msg: msg,
      hiddenMsg: false,
    })
    setTimeout(function () {
      that.setData({
        hiddenMsg: true,
      })
    }, 2000)
  },
  //订单option点击事件
  orderOptionDidClick: function (e) {
    var orderId = e.currentTarget.dataset.orderid;
    var optionId = e.currentTarget.dataset.optionid;
    var optiontext = e.currentTarget.dataset.optiontext;
    if (optionId == 2) {
      //查看物流
      wx.navigateTo({
        url: '../logistics/logistics?orderId=' + orderId,
      })
    } else if (optionId == 12) {
      //查看团详情
      if (this.data.teamType == 1) {
        //一起买
      } else if (this.data.teamType == 3) {
        //抽奖
        wx.navigateTo({
          url: '../wxuserShare/wxuserShare?groupid=' + this.data.groupid + '&activeId=' + this.data.teamid
        })
      }

    } else if (optionId == 13) {
      //邀请好友
      if (this.data.teamType == 1) {
        //一起买
      } else if (this.data.teamType == 3) {
        //抽奖
        wx.navigateTo({
          url: '../wxuserShare/wxuserShare?groupid=' + this.data.groupid + '&activeId=' + this.data.teamid
        })
      }

    }
    console.log('----liebiao------', orderId, optionId, optiontext)
  },
  // //订单option点击事件
  // orderOptionDidClick: function (e) {
  //   var orderId = e.currentTarget.dataset.orderid;
  //   var optionId = e.currentTarget.dataset.optionid;
  //   var optiontext = e.currentTarget.dataset.optiontext;
  //   var teamType = e.currentTarget.dataset.teamtype;
  //   var teamid = e.currentTarget.dataset.teamid;
  //   var goodsimg = e.currentTarget.dataset.goodsimg;
  //   var groupid = e.currentTarget.dataset.groupid;
  //   console.log('----orderId----', teamType)
  //   // return;
  //   if (optionId == 11) {
  //     //查看订单
  //     wx.navigateTo({
  //       url: '../orderDetail/orderDetail?orderId=' + orderId + "&teamType=" + teamType + "&goodsimg=" + goodsimg + "&activeStaus=" + this.data.activeStatus + "&teamid=" + teamid,
  //     })
  //   } else if (optionId == 12) {
  //     //查看团详情
  //     if (teamType == 1) {
  //       //一起买
  //     } else if (teamType == 3) {
  //       //抽奖
  //       wx.navigateTo({
  //         url: '../wxuserShare/wxuserShare?groupid=' + groupid + '&activeId=' + teamid
  //       })
  //     }

  //   } else if (optionId == 13) {
  //     //邀请好友
  //     if (teamType == 1) {
  //       //一起买
  //     } else if (teamType == 3) {
  //       //抽奖
  //       wx.navigateTo({
  //         url: '../wxuserShare/wxuserShare?groupid=' + groupid + '&activeId=' + teamid
  //       })
  //     }

  //   }
  //    else if (optionId == 14) {
  //     //中奖名单
  //     wx.navigateTo({
  //       url: '../haveWin/haveWin?relativeid=' + teamid,
  //     })
  //   }
  //   console.log('----liebiao------', orderId, optionId, optiontext)
  // },
  //加载假数据
  loadFackData: function () {
    var tabList = [
      {
        "TypeText": "全部",
        "TypeCode": "50",
      },
      {
        "TypeText": "待付款",
        "TypeCode": "60",
      },
      {
        "TypeText": "待发货",
        "TypeCode": "70",
      },
      {
        "TypeText": "待收货",
        "TypeCode": "80",
      },


    ]
    this.setData({
      tabList: tabList
    })
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
    // this.obtainMyOrderList(orderList)
    // this.setData({
    //   orderList: orderList
    // })
    // this.tabList = tabList
  },

  obtainOrderDetailItem: function (orderDetail) {
var that = this;
    
var orderTime = orderUtils.fmtDate(orderDetail.addTime)
    var statusStr = orderUtils.obtainOrderStatus(orderDetail.status);
    //从活动入口进入
    var optionAry =[]
    if (that.data.teamType == 1 || that.data.teamType == 3) {
      optionAry = orderUtils.obtainActiveDetailOptionAry(that.data.activeStaus, that.data.teamType);

    }else {
      // optionAry = orderUtils.obtainOrderOptionAry(orderDetail.status);
       optionAry = orderUtils.obtainOrderOptionAry(orderDetail.status, that.data.isActivityOrder)
    }
   
  var goodsItem = orderDetail.goods[0];
 goodsItem.singleP = Number(goodsItem.price).toFixed(2);
 var imageStr = orderDetail.status == 5 ? "https://m.meigo.com/activities/images/mini-programs/order/orderstatus2.png" :"https://m.meigo.com/activities/images/mini-programs/order/orderstatus1.png"

//  optionAry= [
//    {
//      "optionText": "查看物流",
//      "optionId": 2
//    },
//    {
//      "optionText": "确认收货",
//      "optionId": 3
//    }
//  ]
that.setData({
  statusStr: statusStr,
  optionAry: optionAry,
  orderDetail: orderDetail,
  orderTime: orderTime,
  imagurl: imageStr
})
    
console.log('----------', orderDetail)
    // for (var i = 0; i < orderList.length; i++) {
    //   var orderItem = orderList[i];
    //   var everyOrder = orderItem.orders[0];
    //   var statusStr = orderUtils.obtainOrderStatus(everyOrder.status);
    //   // var optionAry = 

    //   var optionAry = orderUtils.obtainOrderOptionAry(everyOrder.status)
    //   everyOrder.statusStr = statusStr
    //   everyOrder.optionAry = optionAry;
    //   everyOrder.toPrice = Number(everyOrder.totalPrice).toFixed(2)
    
    //   // goodsItem.
    //   // var test1 = arr[i].split('src="');
    //   // var test2 = test1[1].split('"');
    //   // arrImg.push(test2[0]);
    // }
    // this.setData({
    //   orderList: orderList
    // })
    // console.log('---------thi', this.data.orderList)
  },

  //获取地址列表接口
  requestMyOrderDetailData: function () {
    var that = this;
    //加载框
    // that.setData({
    //   hiddenloading: false
    // })
    var cont = {
      // rudder_route: 'VV030077980004000000000000000000000000',
      orderId: that.data.orderId,
      // page: that.data.page,
      // status: that.data.status
    }
    console.log('----deta---',cont)
    var url = PublicUtils.realeName + '/member/order/get';
    PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
      //  data.body;
      //  that.loadFackData()
      console.log('-------dataDetail', data.data.body)
      var orderDetail = data.data.body
      that.setData({
        defaultAddress: orderDetail.consignee,
        orderPrice: Number(orderDetail.total.orderPrice).toFixed(2)
        // goodsDetail: orderDetai.goods[0]
      })
      if (that.data.teamType == 3){
        //需要转换goods对应类型
        
        var goods = orderDetail.goods[0];
        goods.name = orderDetail.goods[0].title;
        // goods.spec = ;
        goods.thumbnailPic = that.data.goodsimg
        goods.quantity = orderDetail.goods[0].zj_nums;
        goods.price = orderDetail.goods[0]. low_price
        orderDetail.goods[0] = goods; 
      }
     
      that.obtainOrderDetailItem(orderDetail)
     
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that = this;
  that.setData({
    // orderId: 2074375,
    orderId: options.orderId,
    imagurl: "https://m.meigo.com/activities/images/mini-programs/order/orderstatus1.png",
    teamType: options.teamType,
    goodsimg: options.goodsimg,
    activeStaus: options.activeStaus,
    teamid: options.teamid,
    groupid: options.groupid,
    isActivityOrder: options.isActivityOrder
  })
  console.log('--------option',options.add)
  // return;
  that.requestMyOrderDetailData()
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