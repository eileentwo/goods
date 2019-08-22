// pages/allCategories /allCategories.js
var app = getApp();
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titlename: '数呗花',
    redBack:'1',
    goodlist: [    ],
    navActive:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'allCate')
    let that=this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          loopH:res.screenHeight-162,
          swiperH:'auto'
        })
      },
    })
   
  },
  toLoop: function (e) {
    let index = e.currentTarget.dataset.index;
    let goodlist = this.data.goodlist;
    for (let i = 0; i < goodlist.length;i++){
      if (goodlist[i] == this.data.toView){
        this.setData({
          toView: goodlist[i]+1
        })
      }
    }
    this.setData({
      current:index,
    })
  },
  change: function (e) {
    console.log(e.detail.current)
    let navActive = e.detail.current;
    this.setData({
      navActive
    })
  },
  // 获取每个bar 到顶部的距离，用来做后面的计算。
  getNum: function () {
    let arr=[];
    let goodlist =this.data.goodlist
    let titleH=140;
    let contentH=82;
    var obj = {};
    var totop = 0;
    // 右侧第一类肯定是到顶部的距离为 0
    obj['top'] = totop;
    arr.push(obj);
    // 循环来计算每个子类到顶部的高度
    for (let i = 1; i < (goodlist.length + 1); i++) {
      totop += (titleH + Math.ceil(goodsItem[i - 1].list_second.length / 4) * contentH)
      obj['top'] = totop;
      arr.push(obj);
    }
    console.log(arr)
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