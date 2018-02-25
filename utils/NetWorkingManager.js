
var config = require('./config.js');
var Http = {
    post: function(url, requestData, success, error){
      console.log(config.baseUrl);
        wx.request({
          url: config.baseUrl + url,
          header: this.beforRequest(url),
          method:'POST',
          data: requestData,
          success: function(response) {
            if (response.statusCode == 200) {
              success(response);
              }else{
                //TODO

              }
          },
          fail: function(err) {
              //TODO
              error(err);
          }
        })
    },
    get: function(url, requestData, success, error){
      url = this.dealData(url, requestData);
      wx.request({
        url: config.baseUrl + url,
        header: this.beforRequest(url),
        method: 'GET',
        success:  (response) => {  
          if (response.statusCode == 200){
            success(response);
          }else{
            //TODO 
          }

        },
        fail: function (err) {
          //TODO
          error(err);
        }
      })
    },



    beforRequest:function(url){
      let userToken = wx.getStorageSync("userToken");
      if(url.indexOf('api') == -1){
        return {'UserToken': userToken?userToken:'',
                'RudderAppType': 'mini',
                'RudderMarket': 'mini',
                'RudderVersion': config.version}
      }else{
        if(userToken){
          return { 'X-Auth-Token': userToken }
        }
      }
    },

    dealData: function(url, data){
      let i = -1;
      for(var k in data){
        i++;
        if(i == 0){
          url = url +'?' + k + '=' + data[k];
        }else{
          url = url +'&' + k + '=' + data[k];
        }
      }
      return url;
    }
};

module.exports = Http;