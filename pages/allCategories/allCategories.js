// pages/allCategories /allCategories.js
var app = getApp();
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
var allDis = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titlename: '数呗花',
    redBack: '1',
    scrollTopId: '',//置顶id
    scrollTop: 0,//置顶高度
    scrollLeft: 0,
    goodlist: [],
    navActive: 0,
    firstI: 0,
    nextI: 1,
    prevI: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight - 162;
    this.setData({
      winHeight,
      longitude:options.longitude,
      latitude: options.latitude,
      curCity: options.store_city 
    })
  },

  clickcategory: function (e) {
    var category_id = e.currentTarget.dataset.category_id;
    var index = e.currentTarget.dataset.index;
    console.log(index)
    let scrollLeft = 0;
    if (index > 2) {
      scrollLeft = 88 * (index - 2)
    }
    this.setData({
      scrollTopId: category_id,
      navActive: index,
      scrollLeft
    })
  },
  contentScroll: function (e) {
    let scrollTop = e.detail.scrollTop
    if (!this.flag) {
      this.flag = true;
      return;
    }

    let scrollLeft = 0;
    for (let i = 0; i < allDis.length; i++) {
      if (allDis[i + 1]) {
        if (allDis[i].num < scrollTop && scrollTop < allDis[i + 1].num) {
          this.flag = false;
          if (i == this.data.nextI || i == this.data.prevI) {//
            console.log(scrollTop, 52)
            this.data.prevI = i - 1;
            this.data.firstI = i;
            this.data.nextI = i + 1;
          }
          if (i > 2) { scrollLeft = 88 * (i - 2) }
          this.setData({
            navActive: i,
            scrollLeft
          })
        }


      }
    }
  },
  getNum: function (data) {
    var totop = 0;
    var titleBox = 140;
    var oneContent = 82;
    var obj = {};
    // 第一类肯定是到顶部的距离为 0

    obj['num'] = totop;
    allDis.push(obj)
    // 循环来计算每个子类到顶部的高度
    for (let i = 1; i < (data.length + 1); i++) {

      var obj = {};
      totop += (titleBox + data[i - 1].list_second.length / 4 * oneContent) / 2;
      obj['num'] = totop;
      allDis.push(obj)
    }
  },
  getData: function () {
    let that = this;
    var timestamp = Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var process = md5.hexMD5(val);

    wx.request({
      url: app.globalData.url + "/api/mini_homepage/list_category",
      method: "POST",
      data: {
        request_object: app.globalData.request_object,
        process,
        timestamp,
      },
      success: function (res) {
        console.log(res, res.data.status);
        //  请求到数据 存在本地
        if (res.data.status == 1) {
          let data = res.data.data;
          let dataL = data.length;
          if (dataL > 0) {
            util.addUrl(data, 'category_pic')
          }
          that.getNum(data)
          that.setData({
            goodlist: data,
          })
        } else {
          wx.showToast({
            title: '数据加载失败请稍后重试',
          })
        }
      }
    })
  },
  toLoop: function (e) {
    let index = e.currentTarget.dataset.index;
    let goodlist = this.data.goodlist;
    for (let i = 0; i < goodlist.length; i++) {
      if (goodlist[i] == this.data.toView) {
        this.setData({
          toView: goodlist[i] + 1
        })
      }
    }
    this.setData({
      current: index,
    })
  },
  change: function (e) {
    let navActive = e.detail.current;
    this.flag = true;
    this.setData({
      navActive
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    this.getData();
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