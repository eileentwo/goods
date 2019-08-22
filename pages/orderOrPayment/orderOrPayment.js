// pages/orderOrPayment/orderOrPayment.js
var app = getApp();
var md5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');
var timestamp =0;
var store_id='';
var user_id = '';
var openid = '';
var token='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titlename: '',
    isUser:true,
    isPhone:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let store_info = wx.getStorageSync('store_info') || [];
    let titlename= options.store_name ;
    let that=this;
    // store_id = 2
    store_id = options.store_id || store_info.store_id ;
    if (options.openid){
      openid = options.openid
      user_id = options.user_id
      token = options.token
    }
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          containerH:res.screenHeight-80
        })
      },
    })
    this.setData({
      titlename,
      store_id
    })
    if (store_info.store_id != store_id) {
      let choosedList=[];
      let order_info = [];
      wx.setStorageSync('choosedList', choosedList);
      wx.setStorageSync('order_info', order_info);
      
      store_info.store_id = store_id
      // 店铺详情
      wx.request({
        url: app.globalData.url+'/api/store_detail/get_store_info_new',
        data: {
          store_id: store_id,
          request_object: app.globalData.request_object,
        },
        method: 'POST',
        header: {
          'Content-Type': "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.status == 1) {
            console.log(res.data.data.store_info,50)
            that.setData({
              titlename: res.data.data.store_info.store_name
            })
            wx.setStorageSync('store_info', res.data.data.store_info)
          } else {
            wx.showToast({
              title: '加载失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function () {
          console.log("店铺详情请求失败");
          wx.showToast({
            title: '服务器响应失败',
            icon: 'none',
            duration: 3000,
          })
        },
        complete: function () {
          // complete
        }
      })

      //商品列表
      wx: wx.request({
        url: app.globalData.url+'/api/store_detail/list_store_goods',
        data: {
          request_object: app.globalData.request_object,
          store_id :store_id,
          page: 1,
          limit: 100
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log('商品列表', res)
          if (res.data.status == 1) {
            let goodsItem = res.data.data;
            for (let i = 0; i < goodsItem.length; i++) {
              goodsItem[i].id = 'id' + i;
              goodsItem[i].select_nums = 0;
              let goods = goodsItem[i].list_goods;
              goods = util.addUrl(goods, 'goods_pic')
              for (let j = 0; j < goods.length; j++) {
                goods[j].num = 0;

              }
            }
            // console.log(goodsItem)
            wx.setStorageSync('goodsItem', goodsItem)

          } else {
            wx.showToast({
              title: '营业日期加载失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '服务器响应失败',
            icon: 'none',
            duration: 3000,
          })
        },
        complete: function (res) { },
      })
    }
  },
  toHome:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  getUserInfo: function(e){
    let that = this;
    let userInfoKey = wx.getStorageSync('userInfoKey') || [];
    var globalKey = wx.getStorageSync('globalKey');
    
    timestamp=Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var hexMd5 = md5.hexMD5(val);
    if (!user_id){
    
      wx.getUserInfo({
        success(res) {
          console.log("获取用户信息成功", res,171)
          if ('getUserInfo:ok' == res.errMsg) {
            var userinfo = res.userInfo;
            
            wx.request({
              url: app.globalData.url+'/api/mini_program/login',
              data: {
                request_object: app.globalData.request_object,
                nickname: userinfo.nickName,
                sex: userinfo.gender,
                headimgurl: userinfo.avatarUrl,
                country: userinfo.country,
                city: userinfo.city ,
                province: userinfo.province,
                unionid: '',
                nickname: userinfo.nickName,
                openid: app.globalData.openid || globalKey.openid || openid ,
                timestamp,
                process: hexMd5,

              },
              method: 'POST',
              success: function (res) {
                
                if (res.data.status == 1) {
                  wx.hideLoading();

                  userInfoKey.userinfo = userinfo;
                  var globalKey = wx.getStorageSync('globalKey');
                  globalKey.user_id = res.data.data.user_id;
                  globalKey.token = res.data.data.token;
                  wx.setStorageSync('globalKey', globalKey)
                  that.setData({
                    isUser: false,
                    user_id:res.data.data.user_id,
                    token: res.data.data.token
                  })
                  wx.showToast({
                    title: '登录成功',
                  })
                }

              }
            })
          }
        },
        fail(res) {
          console.log("获取用户信息失败", res)
          wx.showModal({
            title: '请授权',
            content: '为了让您更好的体验点单服务，请授权！！！',
          })
        }
      })
    }
   
   

  
  
  
  
  },
  showLoading:function(e){
    wx.showLoading({
      title: '加载中',
    })
  },
  // 打开权限设置页提示框
  showSettingToast: function (e) {
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting/setting',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gotoPay() {
    timestamp = Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var hexMd5 = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url +'/api/mini_program/get_config_info',
      method:"post",
      data:{
        timestamp, process: hexMd5
      },
      success:function(res){
        // console.log(res.data.data)
        if (res.data.data.is_open_payment==1){
          wx.navigateTo({
            url: '../payment/payment',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '该功能暂未开放，敬请期待！',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let globalKey = wx.getStorageSync('globalKey');
    console.log(user_id)
    if (globalKey.user_id || user_id) {
      this.setData({
        isPhone: false,
        isUser: false
      })
    } else {
      this.setData({
        isUser: true
      })
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let store_info = wx.getStorageSync('store_info');
    console.log(store_info)
    if (res.from === 'button') {
    }
    return {
      title: '转发',
      path: 'pages/orderOrPayment/orderOrPayment?store_id=' + store_id + '&store_name=' + store_info.store_name ,
      success: function (res) {

      }
    }

  },
})