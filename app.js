//app.js
var md5 = require('./utils/md5.js');
var timestamp = Date.parse(new Date());
var val = 'fanbuyhainan' + timestamp.toString() ;
var hexMD5 = md5.hexMD5(val);

App({
    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        var me=this; 
        var userInfokey = wx.getStorageSync('userInfokey');
        
         // 店铺详情
         wx.request({
           url: 'https://exbuy.double.com.cn/api/store_detail/get_store_info_new',
           data: {
             store_id: me.globalData.store_id
           },
           method: 'POST',
           header: {
             'Content-Type': "application/x-www-form-urlencoded"
           },
           success: function (res) {
             if (res.data.status == 1) {
               // console.log(48, res.data.data)
               me.globalData.store_info = res.data.data.store_info; 
               me.globalData.category_id = res.data.data.category_id;
               me.globalData.store_name = res.data.data.store_info.store_name;
               me.globalData.business_hours = res.data.data.store_info.business_hours;
               me.globalData.store_logo = res.data.data.store_info.store_logo;
               me.globalData.store_score = res.data.data.store_info.store_score;
               me.globalData.store_address = res.data.data.store_info.store_address;
               me.globalData.effective_end = res.data.data.store_info.effective_end;
               me.globalData.effective_start = res.data.data.store_info.effective_start;
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
           url: 'https://exbuy.double.com.cn/api/store_detail/list_store_goods',
           data: {
             store_id: me.globalData.store_id,
             page: 1,
             limit: 100
           },
           method: 'POST',
           dataType: 'json',
           responseType: 'text',
           success: function (res) {
             console.log('商品列表',res)
             if (res.data.status == 1) {
               let goodsItem = res.data.data;
               for(let i=0;i<goodsItem.length;i++){
                 goodsItem[i].id='id'+i;
                 goodsItem[i].select_nums=0;
                 let goods = goodsItem[i].list_goods;
                 for (let j = 0; j < goods.length;j++){
                   goods[j].num=0;
                 }
               }
               me.globalData.goodsItem = goodsItem;
              //  console.log(121)
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
      //  },300);
      //  clearTimeout(timer);
      //登录console.log(1555, userInfokey.hasOwnProperty('openid'))
      if (userInfokey.hasOwnProperty('openid')) {
        return false;
      }
      wx.login({
        success: function (res) {
          console.log(200, res.code)
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://exbuy.double.com.cn/api/mini_program/get_openid',
              data: {
                timestamp,
                process: hexMD5,
                code: res.code,

              },
              method: 'POST',
              success: function (openIdRes) {
                // 判断openId是否获取成功
                console.log('openId', openIdRes)
                if (openIdRes.data.status == '1') {
                  me.globalData.openid = openIdRes.data.data.openid;
                  me.globalData.session_key = openIdRes.data.data.session_key;
                  let userInfokey = {};
                  userInfokey.openid = openIdRes.data.data.openid;
                  wx.setStorageSync('userInfokey', userInfokey)
                }

              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
      
    },
    formatImg: function(img) {
        var compic = "https://www.baidu.com/img/baidu_jgylogo3.gif";
        if (!img) {
            return compic;
        }
        var host = "https://exbuy.double.com.cn";
        if (!img || img.length < 4) {
            return img;
        }
        if (img.substr(0, 4) == 'http') {
            return img;
        } else {
            img = host + img;
        }
        return img;
    },

    globalData: {
      userInfo: '',
      store_info: {},
        store_name:'',
        store_logo:'',
        orderList: {},
        orderCost: 0,
        store_id:2,
        goods_id:'',
      user_id: '',
        account_money:'',
        service_money:'',
        save_money:'',
        no_discount_price:'',
        activity_goods:[],
        discount_goods:[],
        store_score:'',
        order_id:'',
        store_address:'',
        actual_money:'',
        // remark:''
    }
})