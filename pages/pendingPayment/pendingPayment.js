var app = getApp();
var md5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');
var timestamp = 0;

let userInfokey = [];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        store_name:'',
        store_logo:'',
        orderList: [],
        account_money: '',
        discount_price: '',
        service_money: '',
        save_money: '',
        no_discount_price: '',
        add_time:'',
        remark:'',
        order_number:'',
        table_number:'',
        actual_money:'',
        // order_money:''
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
      var that = this;
      let userInfokey = wx.getStorageSync('userInfokey');
      var store_id = app.globalData.store_id || wx.getStorageSync('store_info').store_id;
      let token = app.globalData.token || userInfokey.token
      timestamp=Date.parse(new Date());
      var val = 'fanbuyhainan' + timestamp.toString() + token;
      var hexMD5 = md5.hexMD5(val);
      
      wx.request({
        url: 'https://exbuy.double.com.cn/api/store_detail/insert_order_new',
        data: {
          request_object: app.globalData.request_object,
          user_id: app.globalData.user_id || userInfokey.user_id,
          store_id,
          activity_goods: activity_goods,
          discount_goods: discount_goods,
          timestamp: timestamp,
          process: hexMD5,
          token
        },
        method: 'POST',
        header: {
          'Content-Type': "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.status == 1) {
            console.log("我的订单详情返回数据", res.data)
            that.setData({
              add_time: res.data.data.add_time,
              actual_money: res.data.data.actual_money,
              remark: res.data.data.remark,
              store_logo: res.data.data.store_logo,
              store_name: res.data.data.store_name,
              account_money: res.data.data.account_money,
              discount_price: res.data.data.discount_price,
              save_money: res.data.data.save_money,
              service_money: res.data.data.service_money,
              no_discount_price: res.data.data.no_discount_price,
              orderList: res.data.data.list_goods,
              table_number: res.data.data.table_number || '',
              order_number: res.data.data.order_number 
            })
          } else {
            console.log("我的订单详情请求失败", res.data)
          }
        },
        fail: function () {
          // fail
          console.log("服务器响应失败");

        },
        complete: function () {
          // complete
        }
      })
    },
  cancleOrder: function () {
    let userInfokey = wx.getStorageSync('userInfokey');
    let token = app.globalData.token || userInfokey.token
    timestamp = Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString() + token;
    var store_id = app.globalData.store_id || wx.getStorageSync('store_info').store_id;
    var hexMD5 = md5.hexMD5(val);
        wx.request({
          url: 'https://exbuy.double.com.cn/api/store_detail/insert_order_new',
          data: {
            request_object: app.globalData.request_object,
            user_id: app.globalData.user_id || userInfokey.user_id,
            store_id,
            activity_goods: activity_goods,
            discount_goods: discount_goods,
            timestamp: timestamp,
            process: hexMD5,
            token
            },
            method: 'POST',
            header: {
                'Content-Type': "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.status==1){
                    wx.showModal({
                        title: '提示',
                        content: '确认取消订单?',
                        success(res) {
                            if (res.confirm) {
                              userInfokey.order_id='',
                                wx.setStorageSync('userInfokey', userInfokey)
                              wx.redirectTo({
                                    url: '../storeDetails/storeDetails',
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }else{
                    wx.showToast({
                        title: '订单取消失败',
                        icon: 'none',
                        duration: 2000,
                    })
                }
            },
            fail:function(){
                wx.showToast({
                    title: '服务器响应失败',
                    icon: 'none',
                    duration: 2000,
                })
            }
        })
       
    },
    wetchatPay:function(){
      let userInfokey = wx.getStorageSync('userInfokey');
      var store_id = app.globalData.store_id || wx.getStorageSync('store_info').store_id;
      let token = app.globalData.token || userInfokey.token;

      timestamp = Date.parse(new Date());
      var val = 'fanbuyhainan' + timestamp.toString() + token;
      var hexMD5 = md5.hexMD5(val);
      var that = this;
      //支付订单
      wx.request({
        url: 'https://exbuy.double.com.cn/api/nearby/order_payment_new',
        data: {
          request_object: app.globalData.request_object,
          store_id,
          user_id: app.globalData.user_id || userInfokey.user_id,
          token: token,
          timestamp: timestamp,
          process: hexMD5,
          order_id: userInfokey.order_id,
          paid_type: 2,
          remark: "这是测试数据"
        },
        method: 'POST',
        header: {
          'Content-Type': "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log("支付账单返回数据", res.data)
          //此时应调用微信支付界面
          if (res.data.status == 1) {
            
            wx.navigateTo({
              url: '../payment/payment?total_amount=' + res.data.data.total_amount,
            })
          } else {
            console.log("咋啦", res.data)
          }
        },
        fail: function () {
          // fail
          console.log("支付订单请求失败");

        },
        complete: function () {
          // complete
        }
      }) 
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {

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