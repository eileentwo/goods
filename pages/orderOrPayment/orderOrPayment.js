// pages/orderOrPayment/orderOrPayment.js
var app = getApp();
var md5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');
var timestamp =0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUser:true,
    isPhone:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfokey = wx.getStorageSync('userInfokey');
    console.log(userInfokey, 22)
  },
  /*getPhoneNumber:function(e) {
    var that = this;
    if ("getPhoneNumber:ok" != e.detail.errMsg) {
      wx.showToast({
        icon: 'none',
        title: '快捷登陆失败'
      })
      return;
    }
    let userInfokey = wx.getStorageSync('userInfokey');
    console.log(userInfokey,4222,app.globalData.session_key)
    if (!userInfokey.hasOwnProperty('phoneNum')) {
      let encryptedData = e.detail.encryptedData
      let iv=e.detail.iv
      wx.request({
        url: 'https://exbuy.double.com.cn/api/mini_program/get_phone_number',
        data: {
          request_object: app.globalData.request_object,
              process:md5,
              timestamp,
              session_key: app.globalData.session_key,
               encryptedData,
               iv },
        method: 'POST',
        success: function (phone) {
          console.log(phone)
          if(phone.data.status==1){
            userInfokey.phoneNum = phone.data.data.phoneNumber;

            that.data.phoneNum= phone.data.data.phoneNumber
            wx.setStorageSync('userInfokey', userInfokey)
            that.setData({
              isPhone: false,
            })
          }
        }
      })
    }else{
      that.setData({
        isPhone: false
      })
    }
     
    
  },*/
  getUserInfo: function(e){
    let that=this;
    var userInfokey = wx.getStorageSync('userInfokey');
    userInfokey.user_id = 0;
    userInfokey.token = 0;
    timestamp=Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var hexMd5 = md5.hexMD5(val);
    console.log(!userInfokey.hasOwnProperty('userInfo'))
    if (!userInfokey.hasOwnProperty('userInfo')){

      wx.getSetting({
        success(res) {
          // console.log("res", res)
          if (res.authSetting['scope.userInfo']) {
            console.log("已授权=====")
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success(res) {
                console.log("获取用户信息成功", res)
                if ('getUserInfo:ok' == res.errMsg) {
                  let userinfo = res.userInfo;
                  userInfokey.userInfo = userinfo
                  
                  wx.request({
                    url: 'https://exbuy.double.com.cn/api/mini_program/login',
                    data: {
                      request_object: app.globalData.request_object,
                    nickname: userinfo.nickName,
                    sex: userinfo.gender,
                    headimgurl: userinfo.avatarUrl,
                    country: userinfo.country,
                    city: userinfo.city,
                    province: userinfo.province,
                    unionid: '',
                    nickname: userinfo.nickName,
                      openid: userInfokey.openid,
                      timestamp,
                      process: hexMd5,

                    },
                    method: 'POST',
                    success: function (res) {
                      console.log(res,86)
                      if(res.data.status==1){
                        
                        userInfokey.user_id = res.data.data.user_id;
                        userInfokey.token = res.data.data.token;
                        app.globalData.token = res.data.data.token;
                        app.globalData.user_id = res.data.data.user_id;
                        wx.setStorageSync('userInfokey', userInfokey)
                        that.setData({
                          isUser: false
                        })
                        wx.showToast({
                          title: '登录成功',
                        })
                      } 

                    }
                  })
                }else{
                  that.setData({
                    isUser: true
                  })
                }
              },
              fail(res) {
                console.log("获取用户信息失败", res)
              }
            })
          } else {
            wx.showModal({
              title: '请授权',
              content: '为了让您更好的体验点单服务，请授权！！！',
            })
            console.log("未授权=====")
            // wx.navigateTo({
            //   url: '../login/login',
            // })
          }
        }
      
      })
    } else {
      that.setData({
        isUser: true
      })

    }
   
   

  
  
  
  
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
    let userInfokey = wx.getStorageSync('userInfokey');
    console.log(userInfokey.order_id)
    // if (userInfokey.order_id ){
      wx.navigateTo({
        url: '../payment/payment',
      })
    // }else{
    //   wx.showModal({
    //     content: '你无未付款订单，快去点餐吧！',

    //   })
    // }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let userInfokey = wx.getStorageSync('userInfokey');
    console.log(userInfokey,207)
    if (userInfokey.hasOwnProperty('token') || userInfokey.user_id) {
      this.setData({
        isPhone: false,
        isUser: false
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