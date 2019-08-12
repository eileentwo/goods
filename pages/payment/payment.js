// pages/payment/payment.js
var app = getApp();
var md5 = require('../../utils/md5.js');
var md51 = require('../../utils/md51.js');
var util = require('../../utils/util.js');
var timestamp = Date.parse(new Date());

let userInfokey = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarks:[],//备注
    img: '',
    money:'',
    category:false,//是否显示桌号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        total_amount: options.total_amount,
        img:app.globalData.store_logo
      })
  },

  // 备注
  handleContentInput(event) {
    let textareaValue = event.detail.value;
    this.data.userInput = textareaValue;
    

  },
  formatNum(e) {  //正则验证金额输入框格式   
    e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d{6}).*$/, '$1$2.$3')    
    e.detail.value = e.detail.value.replace(/[\u4e00-\u9fa5]+/g, ""); //清除汉字    
    e.detail.value = e.detail.value.replace(/[^\d.]/g, ""); //清楚非数字和小数点    
    e.detail.value = e.detail.value.replace(/^\./g, ""); //验证第一个字符是数字而不是      
    e.detail.value = e.detail.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //只保留第一个小数点, 清除多余的   
    e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   
   }, 
  handleInput:function(e){    
    var that = this;   
      that.formatNum(e);      
    this.data.value= e.detail.value;    
     
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
    userInfokey = wx.getStorageSync('userInfokey');
    let store_info = wx.getStorageSync('store_info')

    console.log(store_info, app.globalData.category_id)
    if (store_info.category_id =='1' || app.globalData.category_id=='1'){
      this.setData({
        category:true
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
      // wx.navigateTo({
      //     url: '../pendingPayment/pendingPayment',
      // })
  },
  payForWechat: util.throttle(function(){//微信支付
    let that=this
    let userInfokey = wx.getStorageSync('userInfokey');
    let token = app.globalData.token || userInfokey.token
    var store_id = app.globalData.store_id || wx.getStorageSync('store_info').store_id;
    var val = 'fanbuyhainan' + timestamp.toString() + token;
    var hexMD5 = md5.hexMD5(val);
    let payment_money = that.data.value
    wx.request({
      url: 'https://exbuy.double.com.cn/api/mini_program/payment',
      data: {
        user_id: app.globalData.user_id || userInfokey.user_id,
        token: token,
        timestamp: timestamp,
        process: hexMD5,
        store_id,
        openid: app.globalData.openid || userInfokey.openid,
        remark: "这是测试数据",
        remark: that.data.userInput,
        payment_money,
      },
      method: 'POST',
      header: {
        'Content-Type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("payment", res)
        let strmd5 = 'appId=' + res.data.data.appid + '&nonceStr=' + res.data.data.noncestr + '&package=prepay_id=' + res.data.data.prepayid + '&signType=MD5&timeStamp=' + res.data.data.timestamp + '&key=rImE3xCA7U22TWYxFvA2eYq4Umy1NVgP';
        let mypaySign = md51.md5(strmd5);
        let mypackage = 'prepay_id=' + res.data.data.prepayid;
        console.log(mypackage)
       
        //此时应调用微信支付界面
        if (res.data.status == 1) {
          wx.requestPayment({
            timeStamp: res.data.data.timestamp,
            nonceStr: res.data.data.noncestr,
            package: mypackage,
            signType: 'MD5',
            paySign: mypaySign,
            success(res) {
                wx.clearStorageSync('ol')
                wx.showModal({
                  title: '支付成功',
                  content: '您将在“微信支付”官方号中收到支付凭证',
                })
            },
            fail(res) {
              console.log(94,res)
            }
          })
          // 将缓存的ol清空
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
    
   
  },1000) ,
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