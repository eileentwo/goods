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
    console.log(homedata)
    var myAmapFun = new amap.AMapWX({ key: 'd909b59416287f4eeecfd7f57d4251c4' });
    myAmapFun.getWeather({
      success: function (data) {
        //成功回调
        // console.log(data,32)
        that.setData({
          curCity:data.city.data
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })

    if (homedata.length > 0) {
      let list_ad = homedata.data.list_ad;
      let weather = stores.weather;
      let list_category = homedata.data.list_category;
      let list_headlines = homedata.data.list_headlines;
      let list_recommend = homedata.data.list_recommend;
      let list_goods_choice = homedata.data.list_goods_choice;
      
      this.setData({
        list_ad,
        list_category,
        list_headlines,
        list_recommend,
        list_goods_choice,
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
          that.getHomedata(res.longitude, res.latitude);
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
   
  },
  getHomedata: function (longitude, latitude) {
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
        latitude,
        longitude,
        timestamp,
        process,
        token,
      },
      success: function (res) {
        // console.log('index', res.data.status)
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
          
          let str ='https://exbuy.double.com.cn'; 
               
          for (let i = 0; i < list_goods_choice.length;i++){
            list_goods_choice[i].store_logo= list_goods_choice[i].store_logo.replace(str, '');
          }

          console.log('index117', homedata)
          homedata.data = res.data.data;
          console.log('index', homedata)
          wx.setStorageSync('homedata', homedata);
          
          that.setData({
            longitude, latitude,
            list_ad,
            list_category,
            list_headlines,
            list_recommend,
            list_goods_choice,
            list_goods_save,
            weather
          })

        }
      }
    })
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
