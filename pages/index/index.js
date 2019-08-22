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
    curCity:'',//当前城市
    weather:'下雨',
    page:1,
    isAdd:true,
    stores:[],
    topNum:0,
    hide:false,
    status:0
  },
  onLoad: function () {

  },
  welcome:function(){
    this.getLocal();
    this.setData({
      hide:true
    })
  },
  changeCity: function () {
    console.log('changeCity')
    let city = this.data.curCity
    wx.navigateTo({
      url: '../citys/citys?city=' + city,
    })
  },
  // 获取地址
  getLocal: function (){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx: wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        console.log(res)

        var myAmapFun = new amap.AMapWX({ key: 'd909b59416287f4eeecfd7f57d4251c4' });
        myAmapFun.getRegeo({
          location: '' + res.longitude + ',' + res.latitude + '',
          success: function (data) {

            //成功回调
            let city = data[0].regeocodeData.addressComponent.city;
            let re = new RegExp("市");
            city = city.replace(re, "");
            that.getHomedata(city,res.longitude, res.latitude)
          },
          fail: function (info) {
            //失败回调
            console.log(info)
            wx.showLoading({
              title: 'myAmapFunW',
            })
          }
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  swiperChange: function (e) {
    console.log(205, e)
    if (e.detail.source=='touch'){

      this.setData({
        swiperCurrent: e.detail.current
      })
    }
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

  },
  saoma: function(){
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      success: res => {
        console.log(res.errMsg)
        if (res.errMsg == 'scanCode:ok') {
          wx.navigateTo({
            // url: '../../pages/search/search?keyword=' + res.result
          })
        }
      },
      fail: res => {
        // 接口调用失败
        wx.showToast({
          icon: 'none',
          title: '接口调用失败！'
        })
      },
      complete: res => {
        // 接口调用结束
        console.log(res)
      }
    })
  },
  onShow:function(){
    let that = this;
    homedata = wx.getStorageSync('homedata') || [] ;
    console.log(homedata, 28)

    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          contentH: res.screenHeight
        })
      },
    })
    let curCity=this.data.curCity;
    if (this.data.status==1){
      this.getHomedata(curCity);
      return;
    }
    if (homedata.curCity) {
      that.setHomeData(homedata);
      that.setData({
        hide:true
      })
    } else {
      this.getLocal();
    }
  },
  // 获取数据
  getHomedata: function (curCity,longitude, latitude) {
    let that = this;
    var timestamp = Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var process = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url + '/api/mini_homepage/get_home_info',
      method: "POST",
      data: {
        store_city: curCity,
        store_area: '',
        latitude,
        longitude,
        timestamp,
        process,
        request_object: 'mini_program',
      },
      success: function (res) {
        console.log('index', res.data,128)
        var data = res.data;
        if (typeof data === 'string') {
          data = JSON.parse(data.trim());
        }
        if (data.status == '1') {
          let homedata = data.data;
          wx.hideLoading();

          homedata.curCity = curCity;
          homedata.longitude = longitude;
          homedata.latitude = latitude;

          that.setHomeData(homedata);
          wx.setStorageSync('homedata', homedata);
        }
      }
    })
  },
  // 渲染数据
  setHomeData: function (homedata){
    let that=this;
    let list_ad = homedata.list_ad;
    let weather = homedata.weather;
    let list_category = homedata.list_category;
    let list_headlines = homedata.list_headlines;
    let list_store_choice = homedata.list_store_choice;
    let list_store_save = homedata.list_store_save;
    let curCity = homedata.curCity;
    let longitude = homedata.longitude;
    let latitude = homedata.latitude;

    list_ad = util.addUrl(list_ad,'ad_pic');
    list_category = util.addUrl(list_category,'category_pic');

    list_store_choice = util.addUrl(list_store_choice,'store_logo');
    list_store_save = util.addUrl(list_store_save, 'store_logo');

    that.setData({
      list_ad,
      list_category,
      list_headlines,
      list_store_choice,
      list_store_save,
      longitude,
      latitude,
      curCity,
      weather
    })
  },
  
  //监听屏幕滚动 判断上下滚动

  contentScroll: function (ev) {
    console.log(ev);
    let that = this;
    if (that.data.isAdd) {
      that.data.isAdd = false;
      that.data.page++;
      that.getMoreData(that.data.page);

    }

    
  },
  getMoreData: function (page){
    let that=this;
    var timestamp = Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var process = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url + '/api/mini_homepage/list_store_more',
      method: "POST",
      data: {
        store_city: that.data.curCity,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        page,
        store_area: '',
        timestamp,
        process,
        request_object: 'mini_program',
        limit: 5,
      },
      success: function (res) {
        console.log('moredata', res.data)
        if (res.data.status == '1') {
          let newData = res.data.data

          let stores=that.data.stores;


          if (newData.length>0){
            newData = util.addUrl(newData, 'store_logo');
            for(let i=0;i<newData.length;i++){
              stores.push(newData[i])
            }
            console.log(stores)

            that.data.isAdd=true
            that.setData({
              stores,
              page,
            })
          }else{
            wx.showToast({
              title: '没有更多数据了！',
            })
          }
          
        }
      }
    })
  },
  // 获取滚动条当前位置
  scrolltoupper: function (e) {
    // console.log(e)
    if (e.detail.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //回到顶部
  toTop: function (e) {  // 一键回到顶部
    this.setData({
      topNum: 0
    });
  },

})
