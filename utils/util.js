var url = 'https://exbuy.double.com.cn/';
var request_object= 'mini_program';
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function throttle(fn,gapTime){
  if(gapTime == null || gapTime == undefined){
    gapTime=1500
  }
  let lastTime=null
  return function(){
    let nowTime= +new Date();
    if(nowTime - lastTime> gapTime || !lastTime){
      fn.apply(this,arguments);
      lastTime =nowTime
    }
  }
}
function praseStrEmpty(str) {
  if ( typeof (str) == 'undefined' || typeof (str) == "object") {
    return "";
  }
  return str;
} 
// 处理没http的图片
function addUrl(obj, src) {

  let re = /^\//;
  if (src) {
    src = src.substring(0, src.length);
    for (let i = 0; i < obj.length; i++) {
      if (obj[i][src]) {
        obj[i][src] = obj[i][src].replace(re, url);
      }
    }
  }
  return obj
}

function addHistory(keyName, newData) {
  let keyData = wx.getStorageSync(keyName) || [];
  let tempList = {};

  let len = 10;
  if (newData != '' && !this.isInArray(keyData, newData)) {
    tempList['name'] = newData;
    console.log(keyData)
    if (keyData.length < len) {
      keyData.push(tempList);
    } else {
      keyData = keyData.slice(1, len);
      keyData.push(newData);
    }
    console.log(92, keyData)
    wx.setStorageSync(keyName, keyData)
  }
}
// 判断是否有在数组内
function isInArray(arr, value) {

  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i].name) {
      return i + 1;
    }
  }
  return false;
}



function formatNum(e) {  //正则验证金额输入框格式  
  let value = e.detail.value;
  value = value.replace(/^(\-)*(\d+)\.(\d{6}).*$/, '$1$2.$3')
  value = value.replace(/[\u4e00-\u9fa5]+/g, ""); //清除汉字    
  value = value.replace(/[^\d.]/g, ""); //清楚非数字和小数点     
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //只保留第一个小数点, 清除多余的   
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  
  value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是小数点      
  return value
}


var md5 = require('./md5.js');
function returnGram() {
  let globalKey = wx.getStorageSync('globalKey');
  let token = globalKey.token || '';
  var timestamp = Date.parse(new Date());
  var val = 'fanbuyhainan' + timestamp.toString() + token;
  var process = md5.hexMD5(val);

  let gram = [{
    token,
    timestamp,
    process
  }]
  return gram[0]
}

function returnOrderInfo(user_id, order_id){
  wx.request({
    url:url + '/api/store_order/get_order_info',
    data: {
      request_object,
      user_id,
      order_id,
      timestamp: gram.timestamp,
      process: gram.process,
      token: gram.token
    },
    method: 'POST',
    header: {
      'Content-Type': "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.data.status == 1) {
        let newdata = res.data.data;
        console.log("我的订单详情返回数据", res.data)
        return newdata
      } else {
        console.log("我的订单详情请求失败", res.data)
      }
    },
    fail: function () {
      // fail
      console.log("服务器响应失败");
      app.showMind();

    },
    complete: function () {
      // complete
    }
  })
}
function returnCode(qrcode_url){
  new QRCode('myQrcode', {
    text: qrcode_url,
    width: 46,
    height: 46,
    padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
    correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
    callback: (res) => {
      // console.log(res.path, 71111)
      let myQrcodeSrc = [];
      myQrcodeSrc.push(res.path)
      // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
      return myQrcodeSrc
    }
  })
}
function login(userinfo, mobile, me, num, app, scene) {
  let gram = returnGram();
  let globalKey = wx.getStorageSync('globalKey');
  let store_info = wx.getStorageSync('store_info');

  wx.setStorageSync('userInfoKey', userinfo);
  console.log(globalKey, gram, scene, 16777, 'utils', app.globalData.scene)
  let temparr = { };
  let openid='';
  if (globalKey.hasOwnProperty('newopenid1') || app.globalData.newopenid1 !=''){
    openid = globalKey.newopenid1 || app.globalData.newopenid1
  }else{
    app.getOpenId();
    wx.showModal({
      title: '登录失败',
      content: '访问超时，请重试！',
    })
    wx.hideLoading();
    return;
  }
  wx.request({
    url: url + '/api/mini_program/login',
    data: {
      request_object,
      nickname: userinfo.nickName,
      sex: userinfo.gender,
      headimgurl: userinfo.avatarUrl,
      country: userinfo.country,
      city:globalKey.city || '',
      province: userinfo.province,
      unionid: '',
      nickname: userinfo.nickName,
      openid: openid,
      timestamp: gram.timestamp,
      process: gram.process,
      mobile: mobile || '',
      store_id: store_info.store_id_new || app.globalData.store_id_new || '',
      scene: scene || store_info.scene
    },
    method: 'POST',
    success: function (res) {
      console.log(res, 178, 'login', mobile)
      if (res.data.status == 1) {
        wx.hideLoading();
        temparr.user_id = res.data.data.user_id;
        temparr.token = res.data.data.token;
        globalKey.user_id = res.data.data.user_id;
        globalKey.token = res.data.data.token;

        globalKey.newuser1 = '1';
        app.globalData.newuser1 = '1';
        wx.setStorageSync('globalKey', globalKey)
        wx.showToast({
          title: '登录成功',
        })
        let isClose='';
        if(num==1){
          let arr = me.returnArr();
          let user_id = arr[0].user_id;

          if (user_id) {
            arr[0].order_status = me.data.isActive
            me.getData(arr[0]);
            me.setData({
              nodata: false,
            })
          }
        }
        console.log(num, 205)

        if(num==2){
          isClose = false;
          // app.getquery(app.globalData.query, globalKey, app.globalData.sceneInfo)
          let query = app.globalData.query || wx.getStorageSync('query');
          app.getquery(query, globalKey);
        }
        me.setData({
          isUser: false,
          isPhone: false,
          isshowModal: false,
          isClose,
          user_id: res.data.data.user_id,
          token: globalKey.token, isUser: false, isshowModal: false, userinfo
        })
      }

    },
    fail(res){
      app.showMind();
    }
  })
}
function reLaunchindex() {
  wx.switchTab({
    url: '../home/index',
  })
}
function showModal(me,app) {

  let globalKey = wx.getStorageSync('globalKey');
  let newuser1 = globalKey.newuser1;
  
  let user_phone = globalKey.user_phone || app.globalData.user_phone;
  // console.log(user_phone, newuser1, user_phone != undefined,  newuser1 != undefined,user_phone, 'showModal')
  if (praseStrEmpty(user_phone) != 'undefined') {
    me.setData({
      isPhone: true,
      isshowModal: true,
    })
  } else {
    me.setData({
      isPhone: false,
      isshowModal: false,
    })
  }
  // 用户
  if (praseStrEmpty(newuser1)  != 'undefined'){

    me.setData({
      isshowModal: false,
      isUser: false,
    })
  } else {
    me.setData({
      isUser: true,
      isshowModal: true,
    }) 

  }
  
  // wx.getSetting({
  //   success(res) {
  //     if (res.authSetting['scope.userInfo']) {
  //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  //       wx.getUserInfo({
  //         success: function (res) {
  //           me.setData({
  //             isshowModal: false,
  //             isUser: false,
  //           })
  //         },
  //       })
  //     }else{
  //       me.setData({
  //         isUser: true,
  //         isshowModal: true,
  //       })
  //     }

  //   }
  // })
}
function storeInfo(that, store_id, user_id, scene, app, index){
  // 店铺详情
  console.log(that, '店铺详情', store_id,316)
  let gram=returnGram();
  user_id = user_id ||'';
  wx.request({
    url: url + '/api/store_detail/get_store_info_new',
    data: {
      store_id: store_id,
      user_id,
      scene: scene || 1,
      timestamp: gram.timestamp,
      process: gram.process,
      request_object: request_object,
    },
    method: 'POST',
    header: {
      'Content-Type': "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.data.status == 1) {
        let data = res.data.data.store_info;
        let store_info = wx.getStorageSync('store_info');
        console.log(data, 50, '店铺详情', store_info, scene)
        let tmp_tabnum = store_info.table_number || '';

        store_info = data;
        if (scene != 1) {
          store_info.table_number = tmp_tabnum;
        }else{
          store_info.table_number = ''
        }
        store_info.scene = scene;
        wx.setStorageSync('store_info', store_info);
        
        app.globalData.store_info = store_info;
        that.setData({
          titlename: data.store_name, category_id: data.category_id
        })
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
    url: url + '/api/store_detail/list_store_goods',
    data: {
      timestamp: gram.timestamp,
      process: gram.process,
      request_object: request_object,
      store_id: store_id,
      page: 1,
      limit: 100,
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
          goods = addUrl(goods, 'goods_pic')
          for (let j = 0; j < goods.length; j++) {
            goods[j].num = 0;
          }
        }
        goodsItem = goodsItem.filter(function (res) {
          return res.list_goods.length > 0
        });
        
        /* // if(goodsItem.length>0){
          //   that.setData({
          //     hasGoods:true
          //   })
          // }else{
            // that.setData({
            //   hasGoods: false
            // })
            // wx.showToast({
            //   title: '店铺装修中',
            //   icon:'',
            //   duration:2000
            // })
          // }
        */
        wx.setStorageSync('goodsItem', goodsItem)
        if (index ==1){
          wx.navigateTo({
            url: '/pages/storeDetails/storeDetails?' + store_id + '&user_id=' + user_id + '&token=' +gram.token+'&category_id=' ,
          })
        }
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
module.exports = {
  formatTime,
  throttle,
  addUrl,
  isInArray,
  addHistory,
  formatNum,
  returnGram,
  returnOrderInfo,
  returnCode,
  login,
  storeInfo,
  showModal,
  praseStrEmpty,
  reLaunchindex
}
