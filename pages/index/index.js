//index.js
//获取应用实例

var app = getApp();
var util = require('../../utils/util.js');
var amap = require('../../utils/amap-wx.js');
var md5 = require('../../utils/md5.js');
var time=1000;
let homedata=[];
Page({
  data: {
    titlename:'一鹿省',
    url:app.globalData.url,
    currentSwiper:0,
    imgUrls: ['../../images/cake.png','../../images/cake.png'],
    currentSwiper:0,
    goodsItem1: ['', '李记自助餐厅', '李记自助餐厅'],
    goodsItem2: ['李记自助餐厅', '李记自助餐厅', '李记自助餐厅'],
    stores:[],
    curCity:'',//当前城市
    weather:'下雨',
    
    store_info: [{ store_id: "2", store_name:'甜品'}],
  },
  onLoad: function () {
    let that=this;
    homedata = wx.getStorageSync('homedata') ||[];
    console.log(homedata,28)
    

    if (homedata.length > 0) {
      let list_ad = homedata.data.list_ad;
      let weather = stores.weather;
      let list_category = homedata.data.list_category;
      let list_headlines = homedata.data.list_headlines;
      let list_recommend = homedata.data.list_recommend;
      let list_goods_choice = homedata.data.list_goods_choice;
      let list_goods_save = homedata.data.list_goods_save;
      
      this.setData({
        list_ad,
        list_category,
        list_headlines,
        list_recommend,
        list_goods_choice,
        list_goods_save,
        curCity,
        weather
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx: wx.getLocation({
        type: 'gcj02',
        altitude: true,
        success: function (res) {
          let curCity=that.data.curCity
          console.log(21, curCity)
          var myAmapFun = new amap.AMapWX({ key: 'd909b59416287f4eeecfd7f57d4251c4' });
          myAmapFun.getRegeo({
            success: function (data) {
              //成功回调
              let city = data[0].regeocodeData.addressComponent.city
              
              that.getHomedata(res.longitude, res.latitude, city);
              
            },
            fail: function (info) {
              //失败回调
              console.log(info)
            }
          })
          
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
   
  },
  getHomedata: function (longitude, latitude, curCity) {
    console.log(longitude, latitude, 78, curCity)
    let that = this;
    let userInfokey = wx.getStorageSync('userInfokey');
    var timestamp = Date.parse(new Date());
    let token = userInfokey.token || '';
    var val = 'fanbuyhainan' + timestamp.toString() + token;
    var process = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url + '/api/mini_homepage/get_home_info',
      method: "get",
      data: {
        store_city:curCity,
        latitude,
        longitude,
        timestamp,
        process,
        token,
      },
      success: function (res) {
        console.log('index', res.data)
        if (res.data.status == '1') {
          let stores = res.data.data;
          wx.hideLoading();

          let weather = stores.weather
          let list_ad = stores.list_ad
          let list_category = stores.list_category
          let list_headlines = stores.list_headlines
          let list_recommend = stores.list_recommend
          let list_goods_choice = stores.list_goods_choice;
          let list_goods_save = stores.list_goods_save;
          
          list_goods_choice = that.deleUrl(list_goods_choice);
          list_goods_save = that.deleUrl(list_goods_save);

          homedata.data = res.data.data;
          homedata.curCity = curCity;
          wx.setStorageSync('homedata', homedata);
          
          that.setData({
            longitude, latitude,
            list_ad,
            list_category,
            list_headlines,
            list_recommend,
            list_goods_choice,
            list_goods_save,
            curCity,
            weather
          })

        }
      }
    })
  },
  deleUrl: function (obj) {
    let str = 'https://exbuy.double.com.cn'; 
    for (let i = 0; i < obj.length; i++) {
      obj[i].store_logo = obj[i].store_logo.replace(str, '');
    }
    return obj
  },
  swiperChange: function (e) {
    console.log(205, e)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: '转发',
      path: 'pages/index/index',
      success: function (res) {

      }
    }

  }
})
