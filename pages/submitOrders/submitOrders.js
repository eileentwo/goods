var app = getApp();
var md5 = require('../../utils/md5.js');
var md51 = require('../../utils/md51.js');
var util = require('../../utils/util.js');
var timestamp =0;

var textcontent = '';
var table_number = ''; 

Page({ 
    data: {
        showModalStatus: false,
        orderList: [],
        orderCost: 0,
        account_money: '',
        discount_price: '',
        service_money: '', 
        save_money: '',
        no_discount_price: '',
        store_name :'',
        store_logo:'',
        actual_money:'',
        userInput:'',
        isShowmore:false,
      isMask:false,
    },
    clearInput: function () {
        this.setData({
            userInput: ''
        });
    },
    powerDrawer: function(e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.util(currentStatu);

    },
    util: function(currentStatu) {
        /* 动画部分 */
        // 第1步：创建动画实例 
        var animation = wx.createAnimation({
            duration: 200, //动画时长
            timingFunction: "linear", //线性
            delay: 0 //0则不延迟
        });

        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;

        // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
        animation.translateY(240).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function() {
            // 执行第二组动画：Y轴不偏移，停
            animation.translateY(0).step()
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            })

            //关闭抽屉
            if (currentStatu == "close") {
                this.setData({
                    showModalStatus: false
                });
            }
        }.bind(this), 200)

        // 显示抽屉
        if (currentStatu == "open") {
            this.setData({
                showModalStatus: true
            });
        }
    },
  onShow: function () {
    
    console.log(78, 'submit', wx.getStorageSync('userInfokey') )
    let userInfokey= wx.getStorageSync('userInfokey')
      let that = this;
        that.setData({
            account_money: userInfokey.account_money,
            discount_price: userInfokey.discount_price,
            service_money: userInfokey.service_money,
            save_money: userInfokey.save_money,
            no_discount_price: userInfokey.no_discount_price,
            actual_money: userInfokey.actual_money,
            store_name: app.globalData.store_name,
            store_logo: app.globalData.store_logo,
            store_address: app.globalData.store_address,
          isMask:false,
        })
        var no_discount_price = userInfokey.no_discount_price;
        var ol = wx.getStorageSync('ol');
       
        if (!ol) {
            console.log("没有选择菜品");
        } else {
            for (let k in ol) {
              ol[k].cost = ol[k].goods_selenum * ol[k].discount_price;
          }
            var oc = app.globalData.orderCost;
          that.setData({
            orderList: ol,
                orderCost: oc
            })
        }
    },

    // 备注
    handleContentInput(event) {
        let textareaValue = event.detail.value;
        textcontent = textareaValue;
        this.setData({
            userInput: textareaValue
        });
        
    },
    // 桌号
    table_number:function(e){
      this.data.table_number = e.detail.value;
      console.log(this.data.table_number, e.detail.value)
    },
  wechatPay: function () {
      var that = this;
    let userInfokey = wx.getStorageSync('userInfokey');
    var store_id = app.globalData.store_id || wx.getStorageSync('store_info').store_id;
       timestamp = Date.parse(new Date());
      let token = app.globalData.token || userInfokey.token
      var val = 'fanbuyhainan' + timestamp.toString() + token;
      var hexMD5 = md5.hexMD5(val);
      //支付订单
      wx.request({
        url: 'https://exbuy.double.com.cn/api/mini_program/get_prepay_id',
        data: {
          request_object: app.globalData.request_object,
          store_id,
          user_id: app.globalData.user_id || userInfokey.user_id,
          openid: app.globalData.openid || userInfokey.openid,
          token,
          timestamp: timestamp,
          process: hexMD5,
          order_id: userInfokey.order_id,
          paid_type: 2,
          remark: that.data.userInput || '',//备注
          table_number: that.data.table_number || ''
        },
        method: 'POST',
        header: {
          'Content-Type': "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(token,"支付账单返回数据", res.data)
          //此时应调用微信支付界面
          if (res.data.status == 1) {
            let order_info = [];
            let choosedList = [];
            let goodsItem = wx.getStorageSync('goodsItem');

            for (var i in goodsItem) {
              goodsItem[i].select_nums = 0;
              for (var j in goodsItem[i].list_goods) {
                goodsItem[i].list_goods[j].num = 0;
              }

            }
            wx.setStorageSync('goodsItem', goodsItem);

            wx.setStorageSync('choosedList', choosedList);
            wx.setStorageSync('order_info', order_info);
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
                  that.setData({
                    isMask:true
                  })
                  wx.showModal({
                    title: '支付成功',
                    content: '您将在“微信支付”官方号中收到支付凭证',
                  })
                  setTimeout(function(){
                    wx.reLaunch({
                      url: '../orderOrPayment/orderOrPayment'
                    })
                  },1000)
                },
                fail(res) {
                  console.log(94, res)
                }
              })
              // 将缓存的ol清空
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000,
              })
              // console.log("咋啦", res.data)
            }
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
            })
            // console.log("咋啦", res.data)
          }
        },
        fail: function () {
          // fail
          console.log("支付订单请求失败");

          wx.showToast({
            title: "支付订单请求失败",
            icon: 'none',
            duration: 2000,
          })
        },
        complete: function () {
          // complete
        }
      })
    },

  showMore(){
    console.log(this.data.orderList)
    let num = parseInt(this.data.orderList.length);
    if(num>3){
      this.setData({
        moreH: num * 150,
        isShowmore: true
      })
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { 
    
  },
})