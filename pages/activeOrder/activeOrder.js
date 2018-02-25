// pages/myOrder/myOrder.js
var PublicUtils = require('../../utils/PublicUtils.js');
var orderUtils = require('../../utils/orderUtils.js');//obtainOrderStatus
var requestUtils = require('../../utils/requestUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    showBg: true,
    showRefuseSelectView: true,
    PageSize: 10,
    orderIext: '',
    activeStatus:1,
    activeAry:[],
    maxPage: '',
    pageNum: 1,
    nodata:false,
    hiddenloading:true
  },
  //头部点击事件
  orderChange: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    if (that.data.activeStatus == id) {
      return;
    }
    that.setData({
      activeStatus: e.currentTarget.dataset.id,
      activeAry: [],
      nodata: false,
      maxPage: '',
      pageNum: 1
    })

    that.requestActivieOrderListData()
    // console.log('------id---', id)
  },
  //我的订单条目点击事件
  // orderItemDidClick: function (e) {
  //   var orderId = e.currentTarget.dataset.orderid;
  //   wx.navigateTo({
  //     url: '../orderDetail/orderDetail?orderId=' + orderId,

  //   })
  // },
  //订单option点击事件
  orderOptionDidClick: function (e) {
    var orderId = e.currentTarget.dataset.orderid;
    var optionId = e.currentTarget.dataset.optionid;
    var optiontext = e.currentTarget.dataset.optiontext;
    var teamType = e.currentTarget.dataset.teamtype;
    var teamid = e.currentTarget.dataset.teamid;
    var goodsimg = e.currentTarget.dataset.goodsimg;
    var groupid = e.currentTarget.dataset.groupid;
    console.log('----orderId----', teamType)
    // return;
    if (optionId == 11){
//查看订单
      wx.navigateTo({
        url: '../orderDetail/orderDetail?orderId=' + orderId + "&teamType=" + teamType + "&goodsimg=" + goodsimg + "&activeStaus=" + this.data.activeStatus + "&teamid=" + teamid + "&groupid=" + groupid,
      })
    } else if (optionId == 12) {
      //查看团详情
      if (teamType== 1){
        //一起买
      } else if (teamType == 3){
        //抽奖
        wx.navigateTo({
          url: '../wxuserShare/wxuserShare?groupid=' + groupid + '&activeId=' + teamid
        })
      }

    } else if (optionId == 13) {
      //邀请好友
      if (teamType == 1) {
        //一起买
      } else if (teamType == 3) {
        //抽奖
        wx.navigateTo({
          url: '../wxuserShare/wxuserShare?groupid=' + groupid + '&activeId=' + teamid
        })
      }

    } else if (optionId == 14) {
//中奖名单
      wx.navigateTo({
        url: '../haveWin/haveWin?relativeid=' + teamid,
      })
    }
    console.log('----liebiao------', orderId, optionId, optiontext)
  },
  
  //加载假数据
  loadActiveTopListData: function () {
    var tabList = [
      
      {
        "TypeText": "进行中",
        "TypeCode": "1",
      },
      {
        "TypeText": "已成团",
        "TypeCode": "2",
      },
      {
        "TypeText": "组团失败",
        "TypeCode": "3",
      },


    ]
    this.setData({
      tabList: tabList
    })
  },

  //
  //获取活动订单
  requestActivieOrderListData:function(){
    var that = this;
    that.setData({
      hiddenloading: false
    })
    var cont = {
      rudder_route: 'VV030077980004000000000000000000000000',
      size: that.data.PageSize,
      page: that.data.pageNum,
      status: that.data.activeStatus
    }
    console.log('--------------------------kkkk',cont)

    var url = PublicUtils.realeName + '/api/groups';
    requestUtils.requestWXData(that, "JAVA","GET", cont, url, function (data) {
      console.log('-------huodongdata', data.data.body);
      var itemList = data.data.body;
      var resultData = (itemList.length == 0 && that.data.pageNum == 1) ? false : true;
    that.setData({
      nodata:resultData,
      hiddenloading:true
    })
    
    if (itemList.length < 10) {
      that.setData({
        maxPage: that.data.pageNum
      })
    }
      //处理数据
      that.obtainActiveOrderDataList(data.data.body)
    })
   
  },
  //处理数据
  obtainActiveOrderDataList:function(activeAry){
    var that = this;
    // optionAry
    for (var i = 0; i < activeAry.length; i++) {
      var activeItem = activeAry[i];
      var teamRemind="";
      console.log('--------op444')
      var price = Number(activeItem.lowPrice).toFixed(2)
      if (that.data.activeStatus==1){
        //进行中
        if (activeItem.missingNum ==0){
          teamRemind = "已成团"
        }else {
            teamRemind = activeItem.groupNumMin + "人团,还差" + activeItem.missingNum + "人成团";
        }
      } 
      var optionAry = orderUtils.obtainActiveOptionAry(that.data.activeStatus, activeItem.missingNum, activeItem.pintuanType);
      activeItem.optionAry = optionAry;
      activeItem.price = price;
      activeItem.teamRemind = teamRemind;
    }
    that.setData({
      // hiddenloading:true,
      activeAry: that.data.activeAry.concat(activeAry)
    })
  },
  
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadActiveTopListData()
    this.requestActivieOrderListData();//活动
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
    // console.log('```````return', this.data.maxPage, this.data.pageNum)
    console.log("bottom", this.data.maxPage, this.data.pageNum, this.data.maxPage)
    if (!this.data.hiddenloading){
      return
    }else {
      if (this.data.maxPage != '' && this.data.maxPage <= this.data.pageNum) {
        // console.log('```````return')
        return;
      } else {
        this.data.pageNum += 1;
        console.log('=====page++')
        this.requestActivieOrderListData()
        
      }
    }
    
  },

})