// pages/select/select.js
var app = getApp();
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titlename:'搜索',
    result:false,
    isOk:true,
    noResult:true,
    topNum: 0,
    isAdd: true,//是否下拉增加
    selectNum:1,
    stores:[],
    nomore:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let city=options.city;
    let city='厦门市';
    let that=this;
    if (city) {
      this.data.city = city;
      this.hotList(city);
    }

    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        if (res.screenHeight){
          let noStoreH = res.screenHeight -168;
          that.setData({
            noStoreH,
            contentH: noStoreH,
          })
        }
      },
    })
  },
  hotList: function (city) {
    let that=this;
    var timestamp = Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var process = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url + '/api/mini_homepage/list_hot_store',
      method: "post",
      data: {
        timestamp,
        process,
        city,
        request_object: app.globalData.request_object,
      },
      success: function (res) {
        console.log('select', res.data.data)
        if (res.data.status == '1') {
          that.setData({
            hotList:res.data.data
          })
        }
      }
    })
  },
  // 点击热门或者最近搜索
  gotoselect: function (e) {
    this.value = e.detail.value;
    console.log(e)
    this.select();
  },
  // 获取input输入值
  inputup:function(e){
    this.value=e.detail.value;
  },
  // 点击搜索
  select: function () {
    let fromSelect=true;
    let that = this;
    if (that.data.isOk){
      that.data.isOk=false;
      let timer =setTimeout(function () {
        that.data.isOk = true;
       },1000)
      // console.log(that.value,63)
      that.getSelectData(that.value, that.data.city, 1, fromSelect)
    }
  },
  getSelectData: function (store_name, store_city, selectNum, fromSelect) {
    console.log(92, selectNum)
    let that = this;
    let nearList = wx.getStorageSync('nearList') || [];
    nearList.push(store_name);
    wx.setStorageSync('nearList', nearList)
    
    let globalKey = wx.getStorageSync('globalKey');
    // let token = globalKey.token || '';
    // var val = 'fanbuyhainan' + timestamp.toString() + token;
    var timestamp = Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var process = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url + '/api/mini_homepage/list_store_search',
      method: "post",
      data: {
        request_object: app.globalData.request_object,
        timestamp,
        process,
        store_city,
        store_name,
        page: selectNum ,
        limit:10,
      },
      success: function (res) {
        console.log(selectNum,'select106', res.data.data)

        if (res.data.status == '1') {
          let newData = that.addUrl(res.data.data);
          let stores = that.data.stores;
          
          if (fromSelect == 1) {
            stores = newData
          }else{

            for (let i = 0; i < newData.length;i++){
              stores.push(newData[i])
            }
          }
          
          if (newData.length > 0) {
            that.data.isAdd = true
            that.setData({
              stores,
              result: true,
              noResult: true,
              selectNum,
            })
          }else{
            that.data.nomore=2
            wx.showToast({
              title: '没有数据了哦！',
            })
            that.setData({
              noResult: false,
              result: false,
              nomore:2
            })
          }
        }
      }
    })
  },
  addUrl: function (obj) {
    let re=/^\//;
    let str = 'https://exbuy.double.com.cn/'; 
    for (let i = 0; i < obj.length; i++) {
      obj[i].store_logo = obj[i].store_logo.replace(re, str);
    }
    return obj
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

  contentScroll: function (ev) {
    console.log(ev);
    let that = this;
    let selectNum = that.data.selectNum;
    console.log(that.data)
    if (that.data.isAdd) {
      that.data.isAdd = false;
      selectNum++;
      console.log(that.data.nomore)

      if (that.data.nomore==1){
        that.getSelectData(that.value, that.data.city, selectNum)

      }

    }


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