// pages/orderOrPayment/orderOrPayment.js
var app = getApp();
var md5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');
var timestamp =0;
var store_id='';
var userInfoKey=[];
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
    console.log(wx.getStorageSync('userInfoKey'),23)
    let store_info = wx.getStorageSync('store_info') || [];
    let that=this;
    // store_id = 2
    store_id = options.store_id
    if (!store_info.store_id != store_id) {
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
              goods = util.addUrl(goods)
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
    this.setData({
      titlename: options.store_name,
      store_id
    })
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
        url: app.globalData.url+'/api/mini_program/get_phone_number',
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
    var global = wx.getStorageSync('global') || {};
    console.log(global,173)
    timestamp=Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var hexMd5 = md5.hexMD5(val);
    if (!global.user_id){
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
                city: userinfo.city,
                province: userinfo.province,
                unionid: '',
                nickname: userinfo.nickName,
                openid: global.openid || app.globalData.openid,
                timestamp,
                process: hexMd5,

              },
              method: 'POST',
              success: function (res) {
                console.log(res, 86)
                if (res.data.status == 1) {

                  global.user_id = res.data.data.user_id;
                  global.token = res.data.data.token;

                  userInfoKey.push(userinfo)
                  wx.setStorageSync('global', global)
                  wx.setStorageSync('userInfoKey', userInfoKey)
                  that.setData({
                    isUser: false
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
      wx.showModal({
        title: '温馨提示',
        content: '直接付款功能暂未开放，敬请期待！',
      })
      // wx.navigateTo({
      //   url: '../payment/payment',
      // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let global = wx.getStorageSync('global');
    
    if (global.hasOwnProperty('token') || global.user_id) {
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