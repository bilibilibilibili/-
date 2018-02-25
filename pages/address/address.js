// pages/address/address.js
var PublicUtils = require('../../utils/PublicUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    isSelectCell:false,
    hiddenloading:true,
    isSelectCell:false,
    isSubmit:false,
  },
//点击事件
//添加收货地址
  addAddress: function (e) {
    wx.navigateTo({
      url: '../address/editAddress/editAddress?hhhh =' + '0' + "&isEdit=" + 0 + '&haveaddress=' + 0
    })
  },
  //编辑地址
  editAddress:function(e){
    var id = e.currentTarget.dataset.id;
    console.log('------edite', id)
    wx.navigateTo({
      url: '../address/editAddress/editAddress?ddd =' + '1' + '&consigneeId=' + id + "&isEdit=" + 1 + '&haveaddress=' + 0
    })
  },
  //删除
  deleteAddress:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log('----shanchu--',id)
    wx.showModal({
      title: '提示',
      content: '确定要删除地址吗?',
      confirmColor: "#e02e24",
      cancelColor: "#666",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.requestDelectAddress(id)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  //选择地址----提交订单
  selectedCell: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var selectItem = that.data.addressList[index];
    wx.setStorageSync('editAdderss', JSON.stringify(selectItem));
    wx.navigateBack({
      delta: 1
    })
  },
  //获取地址列表接口
  requestAddressListData: function () {
    var that = this;
    //加载框
    // that.setData({
    //   hiddenloading: false
    // })
    var cont = {
      rudder_route: 'VV030077980004000000000000000000000000',
    }
    var url = PublicUtils.realeName + '/member/address/getList';
    PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
  //  data.body;
  //  that.loadFackData()
  console.log('-------data',data.data.body)
  var addressList = data.data.body
    //数据为空,清除缓存
    if (!addressList || addressList.length== 0) {
      wx.removeStorageSync('editAdderss');
    }
    that.setData({
      addressList: addressList
    })
    console.log('--------dddddd----', that.data.addressList)
    })
  },
  // 设置默认地址
  defaultAddress: function (e) {
    var that = this;
    var addressid = e.currentTarget.dataset.id;
    that.setData({
      hiddenloading: false
    })
    var cont = "consigneeId=" + addressid;
    console.log('----moren---id', addressid)
     var url = PublicUtils.realeName + '/wechat/member/setAddressDefault';
    PublicUtils.UserPostAjax(that, "POST", cont, url, function (data) {
     
      that.setData({
        hiddenloading: true
      })
      console.log('----默认--',data)
      that.requestAddressListData()
    })
  },
//请求数据
loadFackData:function(){
  var that = this;
  var addressList = [
    {
      "addrType": 2,
      "address": "11漕河泾啊dddd",
      "city": {
        "regionId": "",
        "regionName": "上海市"
      },
      "regionId": '1',
      "consigneeCard": "",
      "consigneeId": "1050697",
      "consigneeName": "77贺俊欣",
      "consigneeTel": '15021741827',
      "district": {
        "regionId": "",
        "regionName": "徐汇区"
      },
      "isDefault": 0,
      "province": {
        "regionId": "",
        "regionName": "上海"
      }

    },
    {
      "addrType": 2,
      "address": "22漕河泾啊dddd",
      "city": {
        "regionId": "",
        "regionName": "上海市"
      },
      "regionId": '1',
      "consigneeCard": "",
      "consigneeId": "1050697",
      "consigneeName": "88贺俊欣",
      "consigneeTel": '15021741827',
      "district": {
        "regionId": "",
        "regionName": "徐汇区"
      },
      "isDefault": 0,
      "province": {
        "regionId": "",
        "regionName": "上海"
      }

    },
    {
      "addrType": 2,
      "address": "33漕河泾啊dddd",
      "city": {
        "regionId": "",
        "regionName": "上海市"
      },
      "regionId": '1',
      "consigneeCard": "",
      "consigneeId": "1050697",
      "consigneeName": "11贺俊欣",
      "consigneeTel": '15021741827',
      "district": {
        "regionId": "",
        "regionName": "徐汇区"
      },
      "isDefault": 1,
      "province": {
        "regionId": "",
        "regionName": "上海"
      }

    },
    {
      "addrType": 1,
      "address": "44漕河泾啊dddd",
      "city": {
        "regionId": "",
        "regionName": "上海市"
      },
      "regionId": '1',
      "consigneeCard": "",
      "consigneeId": "1111",
      "consigneeName": "22贺俊欣",
      "consigneeTel": '15021741827',
      "district": {
        "regionId": "",
        "regionName": "徐汇区"
      },
      "isDefault": 0,
      "province": {
        "regionId": "",
        "regionName": "上海"
      }

    },
    {
      "addrType": 2,
      "address": "55漕河泾啊dddd",
      "city": {
        "regionId": "",
        "regionName": "上海市"
      },
      "regionId": '1',
      "consigneeCard": "",
      "consigneeId": "222",
      "consigneeName": "33贺俊欣",
      "consigneeTel": '15021741827',
      "district": {
        "regionId": "",
        "regionName": "徐汇区"
      },
      "isDefault": 0,
      "province": {
        "regionId": "",
        "regionName": "上海"
      }

    },
    {
      "addrType": 1,
      "address": "66漕河泾啊dddd",
      "city": {
        "regionId": "",
        "regionName": "上海市"
      },
      "regionId": '1',
      "consigneeCard": "",
      "consigneeId": "333",
      "consigneeName": "55贺俊欣",
      "consigneeTel": '15021741827',
      "district": {
        "regionId": "",
        "regionName": "徐汇区"
      },
      "isDefault": 0,
      "province": {
        "regionId": "",
        "regionName": "上海"
      }

    },
    
  ]
  that.setData({
    addressList: addressList
  });
},
//删除地址请求接口
requestDelectAddress:function(addressID){
  var that = this;
  that.setData({
    hiddenloading: false
  })
  // var cont = {
  //   consigneeId: addressID,
  // }
  var cont = "consigneeId=" + addressID;
  var url = PublicUtils.realeName + '/member/address/remove';
  PublicUtils.UserPostAjax(that, "POST", cont, url, function (data) {
    console.log('---删除-----', data)
    that.setData({
      hiddenloading: true
    })
    that.requestAddressListData()
  })
},

//系统方法
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    // that.loadFackData();
    that.requestAddressListData()
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