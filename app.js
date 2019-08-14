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
             store_id: me.globalData.store_id,
             request_object: me.globalData.request_object,
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
             request_object: me.globalData.request_object,
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
                request_object: me.globalData.request_object,
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
    onShow: function (options) {
      let option = JSON.stringify(options);
      console.log('app.js option-----' + option)
      console.log('app.js>>options.scene--------------------' + options.scene);
      this.sceneInfo(options.scene);
     
    },
    //场景值判断
    sceneInfo: function (s) {
      var scene = [];
      switch (s) {
        case 1001:
          scene.push(s, "发现栏小程序主入口");
          break;
        case 1005:
          scene.push(s, "顶部搜索框的搜索结果页");
          break;
        case 1006:
          scene.push(s, "发现栏小程序主入口搜索框的搜索结果页");
          break;
        case 1007:
          scene.push(s, "单人聊天会话中的小程序消息卡片");
          break;
        case 1008:
          scene.push(s, "群聊会话中的小程序消息卡片");
          break;
        case 1011:
          scene.push(s, "扫描二维码");
          break;
        case 1012:
          scene.push(s, "长按图片识别二维码");
          break;
        case 1014:
          scene.push(s, "手机相册选取二维码");
          break;
        case 1017:
          scene.push(s, "前往体验版的入口页");
          break;
        case 1019:
          scene.push(s, "微信钱包");
          break;
        case 1020:
          scene.push(s, "公众号profile页相关小程序列表");
          break;
        case 1022:
          scene.push(s, "聊天顶部置顶小程序入口");
          break;
        case 1023:
          scene.push(s, "安卓系统桌面图标");
          break;
        case 1024:
          scene.push(s, "小程序profile页");
          break;
        case 1025:
          scene.push(s, "扫描一维码");
          break;
        case 1026:
          scene.push(s, "附近小程序列表");
          break;
        case 1027:
          scene.push(s, "顶部搜索框搜索结果页“使用过的小程序”列表");
          break;
        case 1028:
          scene.push(s, "我的卡包");
          break;
        case 1029:
          scene.push(s, "卡券详情页");
          break;
        case 1031:
          scene.push(s, "长按图片识别一维码");
          break;
        case 1032:
          scene.push(s, "手机相册选取一维码");
          break;
        case 1034:
          scene.push(s, "微信支付完成页");
          break;
        case 1035:
          scene.push(s, "公众号自定义菜单");
          break;
        case 1036:
          scene.push(s, "App分享消息卡片");
          break;
        case 1037:
          scene.push(s, "小程序打开小程序");
          break;
        case 1038:
          scene.push(s, "从另一个小程序返回");
          break;
        case 1039:
          scene.push(s, "摇电视");
          break;
        case 1042:
          scene.push(s, "添加好友搜索框的搜索结果页");
          break;
        case 1044:
          scene.push(s, "带shareTicket的小程序消息卡片");
          break;
        case 1047:
          scene.push(s, "扫描小程序码");
          break;
        case 1048:
          scene.push(s, "长按图片识别小程序码");
          break;
        case 1049:
          scene.push(s, "手机相册选取小程序码");
          break;
        case 1052:
          scene.push(s, "卡券的适用门店列表");
          break;
        case 1053:
          scene.push(s, "搜一搜的结果页");
          break;
        case 1054:
          scene.push(s, "顶部搜索框小程序快捷入口");
          break;
        case 1056:
          scene.push(s, "音乐播放器菜单");
          break;
        case 1058:
          scene.push(s, "公众号文章");
          break;
        case 1059:
          scene.push(s, "体验版小程序绑定邀请页");
          break;
        case 1064:
          scene.push(s, "微信连Wifi状态栏");
          break;
        case 1067:
          scene.push(s, "公众号文章广告");
          break;
        case 1068:
          scene.push(s, "附近小程序列表广告");
          break;
        case 1072:
          scene.push(s, "二维码收款页面");
          break;
        case 1073:
          scene.push(s, "客服消息列表下发的小程序消息卡片");
          break;
        case 1074:
          scene.push(s, "公众号会话下发的小程序消息卡片");
          break;
        case 1089:
          scene.push(s, "微信聊天主界面下拉");
          break;
        case 1090:
          scene.push(s, "长按小程序右上角菜单唤出最近使用历史");
          break;
        case 1092:
          scene.push(s, "城市服务入口");
          break;
        default:
          scene.push("未知入口");
          break;
      }
      return scene;
    },
   // 其中只有在传递 1020、1035、1036、1037、1038、1043 这几个场景值时，才会返回referrerInfo.appid
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
      request_object: 'mini_program',
        // remark:''
    }
})