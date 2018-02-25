// editAddress.js
// var MallUtil = require('../../mall/mallUtil.js');
var PublicUtils = require('../../../utils/PublicUtils.js')
var loaction = require('../../../utils/loaction.js');
var index = [0, 0, 0];
var t = 0;
var show = false;
var moveY = 200;
Page({
  /**   * 页面的初始数据   */
  data: {
    name: '',
    contact: '',
    address: '请选择',
    detailAddress: '',
    isDefaultAddress: '0',
    currentAddressId: '',
    hiddenloading: true,
    show: show,
    hiddenMsg: true,
    msg: '',
    haveaddress:'',
    value: [0, 0, 0],
    showBg: false,
    isEdit: 0,
    province: '',
    city: '',
    county: '',

    showAddressType: false,
    addressTypeid: 1,//家庭公司
    typename: '',
    typenameSure: '请选择',
    addressDetailItem: {},//编辑界面地址信息
    region_Data: [],//所有地址信息
    fightRrovinces: [],
    fightCitys: [],
    fightcountys: [],
    provinId:'',
    cityId:'',
    countyId:'',
    provinSureId: '',
    citySureId: '',
    countySureId: '',
  },
  //点击事件
  //地址类型
  addressTypeDidClick: function () {
    var that = this;
    that.setData({
      showAddressType: true,
      showBg: true,
    })
  },
  //--家庭.公司
  addressTypeIdDidClick: function (e) {
    var that = this;
    var addid = e.currentTarget.dataset.addid;
    var typename = e.currentTarget.dataset.typename;
    that.setData({
      addressTypeid: addid,
      typename: typename
    })
  },
  //--取消,确定
  addresTypeFooterClick: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    that.setData({
      showAddressType: false,
      showBg: false
    })
    if (id == 4) {
      // that.setData({
      //   typename: typename,
      //   // showBg: false
      // })
      if (that.data.typename == '') {
        that.setData({
          typename: '家庭',
        })
      }
      that.setData({
        typenameSure: that.data.typename,
      })
    }
  },
  showMsg: function (msg) {
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
  //移动按钮点击事件
  translate: function (e) {
    var that = this;
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);
  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    // console.log(e);
    var that = this;
    that.setData({
      showBg: false,
    });
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
    var id = e.currentTarget.dataset.id;
    if (id == 666) {
      var address = that.data.province + that.data.city + that.data.county;
      console.log('-----address', address)
      that.setData({
        address: address,
        provinSureId: that.data.provinId,
        citySureId: that.data.cityId,
        countySureId: that.data.countyId,
      });
    }

  },
  /**   * 生命周期函数--监听页面加载   */
  onLoad: function (options) {
    var that = this;
    console.log('------222222-------optio', options)
    that.setData({
      isEdit: options.isEdit,
      haveaddress: options.haveaddress
    })
    console.log('---bianji', options.isEdit)
    if (options.isEdit == 1) {
      that.setData({
        currentAddressId: options.consigneeId,
      });
      that.getAddressMessage()
      // wx.setNavigationBarTitle({
      //   title: '修改收货地址'
      // })
    } else {
      // wx.setNavigationBarTitle({
      //   title: '新增收货地址'
      // })
      that.setData({
        currentAddressId: '',
      });
    }
    //获取省市区信息
    that.obtainLoactionInformation()
  },
  bindChange: function (e) {
    var that = this;
    var val = e.detail.value
    console.log("val-------", val)
    // 判断滑动的是第几个column
    // 若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      console.log('----sheng---')
      that.obtianCityListAry(that.data.fightRrovinces, val[0], function (data) {
        console.log('dddddd----', data)
        that.obtianDistrictsAry(data, 0)
      })
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        console.log('----shi---')
        val[2] = 0;
        that.obtianDistrictsAry(that.data.fightCitys, val[1])
      }
    }
    index = val;
    // console.log(index + " => " + val);
    //更新数据
    that.setData({
      value: [val[0], val[1], val[2]],
      province: that.data.fightRrovinces[val[0]].name,
      city: that.data.fightCitys[val[1]].name,
      county: that.data.fightcountys[val[2]].name,
      provinId: that.data.fightRrovinces[val[0]].areaNum,
      cityId: that.data.fightCitys[val[1]].areaNum,
      countyId: that.data.fightcountys[val[2]].areaNum,
    })
    console.log('------------hhhhhh---------')
    console.log('----gundng-----', that.data.provinId, that.data.cityId, that.data.countyId)

  },
  //获取省市区的信息
  obtainLoactionInformation: function () {
    var that = this;
    //初始化基本信息
    that.setData({
      province: '北京市',
      city: '北京市',
      county: '东城区',
      provinId: '1',
      cityId: '2',
      countyId: '3',
    })
    // //省市区---------
    loaction.getLocationInfo(function (arr) {
      console.log('-----arr---', arr)
      that.setData({
        region_Data: arr
      })
      //省份的信息 'name': a, 'areaNum': c,'next': b
      var locationItem = that.convertToObj(arr[0]);
      that.setData({
        fightRrovinces: locationItem
      })
    });
    that.obtianCityListAry(that.data.fightRrovinces, 0, function (data) {
      console.log('dddddd----', data)
      that.obtianDistrictsAry(data, 0)
    })
  },
  //获取城市列表
  obtianCityListAry: function (provincesAry, index, call) {
    var that = this;
    var cityItem = provincesAry[index];
    var cityindex = Number(cityItem.next);//index == 4;
    var cityAllAry = that.data.region_Data[1]
    var cityAry = cityAllAry[cityindex];//安徽省的市的集合
    var selectCityAry = that.convertToObj(cityAry);
    that.setData({
      fightCitys: selectCityAry
    })
    call(selectCityAry)
  },
  obtianDistrictsAry: function (cityAry, index) {
    var that = this;
    var disItem = cityAry[index];
    var disindex = Number(disItem.next);;
    var disAllAry = that.data.region_Data[2]
    var disAry = disAllAry[disindex];
    var selectDisAry = that.convertToObj(disAry);
    that.setData({
      fightcountys: selectDisAry
    })
  },
  convertToObj: function (arr) {
    var that = this;
    var data = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var a = item.split(':')[0];
      var c = item.split(':')[1];
      var b = item.split(':')[2];
      data.push({
        'name': a,
        'areaNum': c,
        'next': b
      });
    }
    return data;
  },
  // obtainLocationWith: function (index,v) {
  //   var that = this;
  //   v.citys = that.convertToObj(that.data.region_Data[1][v.next]);
  //   // console.log('---v.citys---', v.citys);
  //   // return;
  //   for (var j in v.citys) {
  //     v.citys[j].districts = that.convertToObj(that.data.region_Data[2][v.citys[j].next]);
  //   }
  // },
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },

  // 设为默认地址
  changeAddressStatus: function (e) {
    this.setData({
      isDefaultAddress: e.detail.value == true ? '1' : '0'
    })
  },
  // 保存地址
  saveAddress: function (e) {
    var that = this;
    if (that.data.name == "") {
      that.showAlertView('请填写收件人姓名')
    } else if (!/^((0\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/.test(that.data.contact)) {
      that.showAlertView('请正确填写手机号')
    } else if (that.data.address == "请选择") {
      that.showAlertView('请选择省市区')
    } else if (that.data.detailAddress == "") {
      that.showAlertView('请填写详情地址')
    }
    else if (that.data.detailAddress == "") {
      that.showAlertView('请填写详情地址')
    } else if (that.data.typenameSure == "请选择") {
      that.showAlertView('请填写地址类型')
    }
    else {
      that.saveAddressRequest()
    }
  },

  showAlertView: function (content) {
    PublicUtils.showModelFun(content, false);
  },
  // // 保存地址
  saveAddressRequest: function () {
    var that = this;
    var cont = "consigneeName=" + that.data.name + "&consigneeTel=" + that.data.contact + "&addrType=" + that.data.addressTypeid + "&address=" + that.data.detailAddress + "&consigneeId=" + that.data.currentAddressId + "&isDefault=" + that.data.isDefaultAddress + "&consigneeCard=" + "" + "&city=" + that.data.citySureId + "&province=" + that.data.provinSureId + "&district=" + that.data.countySureId ;
    // that.setData({
    //   hiddenloading: false
    // })
    // var cont = {
    //   "consigneeName": that.data.name,
    //   "consigneeTel": that.data.contact,
    //   "addrType": that.data.addressTypeid,
    //   "address": that.data.detailAddress,
    //   "consigneeId": that.data.currentAddressId,
    //   "isDefault": that.data.isDefaultAddress,
    //   "consigneeCard": "",
    //   "city": that.data.citySureId,
    //   "province": that.data.provinSureId,
    //   "district": that.data.countySureId,

    // }
    console.log('------------------content------', cont, that.data.city, that.data.province, that.data.county)
    // ---- currentAddressId
    var url = PublicUtils.realeName + '/member/address/save';
    PublicUtils.UserPostAjax(that, "POST", cont, url, function (data) {
      console.log('-----data---',data)
      var consigneeId = data.body.consigneeId;
      that.setData({
        currentAddressId: consigneeId,
        msg: data.message
      })
      // that.showMsg(data.message)
      that.locationAddress()
    })
  },
//本地存储数据跳转
locationAddress:function(){
var that = this;
var address = that.data.address + that.data.detailAddress;
var content =
  {
    "addrType": that.data.addressTypeid,
    "address": that.data.detailAddress,
    "city": {
      "regionId": that.data.citySureId,
      "regionName": that.data.city
    },
    "regionId": '1',
    "consigneeCard": "",
    "consigneeId": that.data.currentAddressId,
    "consigneeName": that.data.name,
    "consigneeTel": that.data.contact,
    "district": {
      "regionId": that.data.countySureId,
      "regionName": that.data.county,
    },
    "isDefault": that.data.isDefaultAddress,
    "province": {
      "regionId": that.data.provinSureId,
      "regionName": that.data.province
    }

  }
  wx.setStorageSync('editAdderss', JSON.stringify(content));
   console.log('---缓存地址----', content)
   wx.navigateBack({
     delta: 2
   })
  //  haveaddress
},
  // 获取地址详情
  getAddressMessage: function () {
    var that = this;
    that.setData({
      hiddenloading: false
    })

    var cont = {
      rudder_route: 'VV030077980004000000000000000000000000',
      consigneeId: that.data.currentAddressId
    }
    var url = PublicUtils.realeName + '/member/address/get';
    PublicUtils.PostGetUserAjax(that, "GET", cont, url, function (data) {
      var addressDetailItem = data.data.body;
      console.log('----信息', addressDetailItem)
      that.setData({
        hiddenloading: true
      })
      that.initAddressMessage(addressDetailItem)

      //addrType 2(公司  1--家庭);
      //consigneeId
      //isDefault
      //姓名  consigneeName  电话 consigneeTel  addrType:1(家庭) address:漕河泾开发区  .province.regionName省 .city.regionName市.district.regionName区
    })
  },
  initAddressMessage: function (conten) {
    var that = this;
    that.setData({
      addressDetailItem: conten
    })
    var address = conten.province.regionName + conten.city.regionName + conten.district.regionName
    that.setData({
      name: conten.consigneeName,
      contact: conten.consigneeTel,
      address: address,
      detailAddress: conten.address,
      typenameSure: conten.addrType == 2 ? "公司" : "家庭",//地址类型
      currentAddressId: conten.consigneeId,
      isDefaultAddress: conten.isDefault,
      provinSureId: conten.province.regionId,
      citySureId: conten.city.regionId,
      countySureId: conten.district.regionId,

    })
  },
  // /**   * 监测方法   */
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputContact: function (e) {
    this.setData({
      contact: e.detail.value
    })
  },
  inputDetail: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },

})

//动画事件
function animationEvents(that, moveY, show) {
  console.log("moveY:" + moveY + "\nshow:" + show);
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  }
  )
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}



