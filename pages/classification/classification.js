// pages/classification/classification.js
var app = getApp();
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titlename:'分类',
    url:app.globalData.url,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.latitude){
      this.getData(options.latitude, options.longitude);
    }
    if (options.store_url){
      
      this.getMoreData(options.store_url, options.store_city);
    }
    
    this.setData({
      titlename: options.category_name
    })
    
  },
  getData: function (latitude, longitude) {//list_store
    console.log('getData')
    let that = this;
    let userInfokey = wx.getStorageSync('userInfokey');
    var timestamp = Date.parse(new Date());
    let token = userInfokey.token || '';
    var val = 'fanbuyhainan' + timestamp.toString() + token;
    var process = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url + '/api/mini_program/list_store',
      method: "POST",
      data: {
        request_object: app.globalData.request_object,
        store_city: '厦门市',
        latitude,
        longitude,
        page: 1,
        limit: 10,
        timestamp,
        process,
        token,
        user_id: userInfokey.user_id || '',
        store_area: '',
        store_name: '',
        category_id: '',
        sec_category_id: '',
      },
      success: function (res) {
        console.log('class', res)
        if (res.data.status == '1') {
          let stores = res.data.data;
          that.setData({
            stores
          })
        }
      }
    })

  },
  // 获取更多结果
  getMoreData: function (store_url, store_city) {
    let that = this;
    var timestamp = Date.parse(new Date());
    // let userInfokey = wx.getStorageSync('userInfokey');
    // let token = userInfokey.token || '';
    // var val = 'fanbuyhainan' + timestamp.toString() + token;
    var val = 'fanbuyhainan' + timestamp.toString() ;
    var process = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url + '/api/mini_program/' + store_url,
      method: "POST",
      data: {
        timestamp,
        process,
        request_object:app.globalData.request_object,

        store_city: store_city,
        
        store_area: '',
      },
      success: function (res) {
        console.log('class', res)
        if (res.data.status == '1') {
          let stores = res.data.data;
          that.setData({
            stores
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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