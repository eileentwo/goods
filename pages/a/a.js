// pages/classification/classification.js
var app = getApp();
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titlename: '分类',
    url: app.globalData.url,
    icons: ['../../images/graybottom.png', '../../images/redtop.png'],
    icon:'',
    page: 1,
    stores: [],
    isAdd: true,
    num: 5,
    half: 0,
    showFruit: false,
    showList:'key1',
    fruitH:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'classif')
    let that = this;
    wx.showLoading({
      title: '加载中',
    })

    let store_url = '';
    let redBack = false;
    let is_save = false;
    let is_choice = false;
    that.data.latitude = options.latitude;
    that.data.longitude = options.longitude;
    that.data.store_city = options.store_city;
    if (options.store_url) {
      store_url = 'mini_homepage/' + options.store_url;

      that.data.store_url = options.store_url;
      that.getData(store_url, options.latitude, options.longitude, options.store_city, '', 1);
    } else {
      store_url = 'mini_program/list_store';
      that.data.category_id = options.category_id;
      that.data.store_url = store_url;
      that.getData(store_url, options.latitude, options.longitude, options.store_city, options.category_id, 1);
    }

    if (options.category_name == '省到爆' || options.category_name == '精选') {
      redBack = true;
      if (options.category_name == '省到爆') {
        is_save = true
      } else {
        is_choice = true
      }
    }
    // console.log('redBack', redBack)
    that.setData({
      titlename: options.category_name,
      city: options.store_city,
      redBack, is_save, is_choice,
      icon:that.data.icons[0],
    })

    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        
        that.setData({
          contentH: res.screenHeight,
          fruitH: res.screenHeight-115,

        })
      },
    })
  },
  changeC:function(e){
    let key =e.currentTarget.dataset.key;
    // console.log(e,key)
    if (key == 'key1') {
      showList = 'key1'
    } else if (key == 'key2') {
      showList = 'key2'
    } else if (key == 'key3'){
      showList ='key3'
    }
    this.setData({
      showFruit:true,
      showList,
    })
  },
  touchHandler: function(){
    return
  },
  getData: function (store_url, latitude, longitude, store_city, category_id, page) {//list_store
    console.log('getData')
    let that = this;
    var timestamp = Date.parse(new Date());
    let userInfokey = wx.getStorageSync('userInfokey');
    let globalKey = wx.getStorageSync('globalKey');
    let token = globalKey.token || '';
    var val = 'fanbuyhainan' + timestamp.toString() + token;
    var process = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url + '/api/' + store_url,
      method: "POST",
      data: {
        request_object: app.globalData.request_object,
        store_city,
        latitude,
        longitude,
        page: page,
        limit: 10,
        timestamp,
        process,
        token,
        user_id: globalKey.user_id || '',
        store_area: '',
        store_name: '',
        category_id: category_id || '',
        sec_category_id: '',
      },
      success: function (res) {
        console.log('class', res)
        if (res.data.status == '1') {
          let num = [];
          let half = 0;
          let newData = util.addUrl(res.data.data, 'store_logo');
          if (newData.length > 0) {
            let stores = that.data.stores
            for (let i = 0; i < newData.length; i++) {
              //评分
              let score = newData[i].store_score;

              if (score) {
                if (score.length > 0) {
                  num.length = score.substr(0, 1);
                  half = 1;
                } else {
                  num.length = score;
                }
              }
              //商品图片
              if (newData[i].list_goods) {
                newData[i].list_goods = util.addUrl(newData[i].list_goods, 'goods_pic')
              }


              stores.push(newData[i])
            }
            wx.hideLoading();

            that.data.isAdd = true
            that.setData({
              stores,
              page,
              num,
              half
            })
          } else {
            if (page > 1) {
              wx.showToast({
                title: '没有更多数据了哦！',
              })
            } else {
              wx.showToast({
                title: '没有相关店铺哦！',
              })
            }
          }
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
    let page = that.data.page;
    if (that.data.isAdd) {
      that.data.isAdd = false;
      page++;
      console.log(page)
      if (that.data.category_id) {
        that.getData(that.data.store_url, that.data.latitude, that.data.longitude, that.data.store_city, that.data.category_id, page);
      } else {
        that.getData(that.data.store_url, that.data.latitude, that.data.longitude, that.data.store_city, page);
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