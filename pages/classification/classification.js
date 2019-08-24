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
    page: 1,
    stores: [],
    isAdd: true,
    num: 5,
    half: 0,
    isShowFruit: false,
    isShowList: true,
    showList: 'key1',
    fruitH: 0,
    onOff1: false,
    onOff2: false,
    onOff3: false,
    activeIndex: 0,
    activeIndex1: 0,
    nactiveIndex: 0,
    nactiveIndex1: 0,
    zactiveIndex: 0,
    isLoad:false,
    isOk:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'classif')
    let that = this;
    let redBack = false;
    let is_save = false;
    let is_choice = false;
    let titlename = '';
    let category_name = '';

    if (options.category_name == '省到爆' || options.category_name == '精选') {
      redBack = true;
      if (options.category_name == '省到爆') {
        is_save = true
      } else {
        is_choice = true
      }
      titlename = options.category_name;
      category_name = '全部';
    } else {
      titlename = '分类';
      category_name = options.category_name;
    }



    that.setData({
      latitude: options.latitude,
      longitude: options.longitude,
      store_city: options.store_city,
      titlename,
      category_name,
      city: options.store_city,
      redBack, is_save, is_choice,
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          contentH: res.screenHeight,
          fruitH: res.screenHeight - 460,
          loadingmaskH: res.screenHeight - 80,
        })
      },
    })
    wx.showLoading({
      title: '加载中',
    })

    let arr = this.returnArr();


    if (options.store_url) {
      console.log(57)
      arr[0].store_url = 'mini_homepage/' + options.store_url;
      that.data.store_url = arr[0].store_url;
    } else {
      console.log(61)
      arr[0].store_url = 'mini_program/list_store';
      arr[0].category_id = options.category_id;
      that.data.category_id = options.category_id;
      that.data.store_url = arr[0].store_url;
    }

    that.getData(this, arr[0])

    that.getCate('list_category', 1);//获取左边分类筛选

    that.getCate('list_area2', 2, options.store_city);//获取附近分类筛选

    that.getCate('list_sort', 3);//获取智能分类筛选
  },
 
  //getData的参数
  returnArr:function(){
    let arr = [{
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      store_city: this.data.store_city,
      page: 1,
    }]
    return arr;
  },
  // 返回request参数
  returnGram() {

    let globalKey = wx.getStorageSync('globalKey');
    let token = globalKey.token || '';
    var timestamp = Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString() + token;
    var process = md5.hexMD5(val);

    let gram = [{
      token,
      timestamp,
      val,
      process
    }]
    return gram[0]
  },
  getCate(near_url, near_num, city) {
    
    let that = this;
    let gram =this.returnGram();
    
    wx.request({
      url: app.globalData.url + '/api/nearby/' + near_url,
      method: "post",
      data: { timestamp: gram.timestamp, process: gram.process, city: city || '' },
      success: function (res) {
        if (res.data.status == 1) {
          let data = res.data.data;
          let dataL = data.length;
          if (near_num == 1) {
            if (dataL > 0) {
              util.addUrl(data, 'category_pic');

              for (let i = 0; i < dataL; i++){
                if(data[i].category_name==that.data.category_name){
                  that.data.activeIndex=i;
                }
              }
            }
            wx.setStorageSync('list_category', data)
            that.setData({
              goodlist: data, list_second: data[0].list_second, category_name: that.data.category_name, activeIndex: that.data.activeIndex,
            })
          }
          if (near_num == 2) {
            that.setData({
              nearData: data, districts: data[0].districts, near_name: data[0].name
            })
          }
          if (near_num == 3) {
            that.setData({
              sortData: data, sort_name: data[0].name
            })
          }
        } else {
          wx.showToast({
            title: '数据加载失败请稍后重试',
          })
        }
      }

    })
  },
  // 导航切换
  changeC: function (e) {
    let key = e.currentTarget.dataset.key;
    let showList = '';
    let isShowFruit = '';
    let onOff1 = this.data.onOff1;
    let onOff2 = this.data.onOff2;
    let onOff3 = this.data.onOff3;

    if (key == 'key1') {
      showList = 'key1';
      onOff1 = !onOff1;
      onOff2 = false;
      onOff3 = false;
    } else if (key == 'key2') {
      showList = 'key2';
      onOff2 = !onOff2;
      onOff1 = false;
      onOff3 = false;
    } else if (key == 'key3') {
      showList = 'key3';
      onOff3 = !onOff3;
      onOff1 = false;
      onOff2 = false;
    }

    if (!onOff1 && !onOff2 && !onOff3) {
      isShowFruit = false
    } else {
      isShowFruit = true
    }

    this.setData({
      isShowFruit, onOff1, onOff2, onOff3,
      showList,
    })
  },
  // 选择二级类型
  changeSecond: function (e) {
    let goodlist = this.data.goodlist;
    let index = e.currentTarget.dataset.index;
    this.data.category_name = goodlist[index].category_name
    this.setData({
      list_second: goodlist[index].list_second,
      activeIndex: index,
    })
  },
  // 选择附近二级类型
  nearSecond: function (e) {
    let index = e.currentTarget.dataset.index
    let nearData = this.data.nearData;

    this.data.store_area=nearData[index].name
    this.setData({
      nactiveIndex: index,
      districts: nearData[index].districts,
    })
  },
  secondData: function (e) {
    let index = e.currentTarget.dataset.index;
    let near_name = e.currentTarget.dataset.near_name || '';
    let category_name = e.currentTarget.dataset.category_name || '';
    let sort = e.currentTarget.dataset.sort || '';
    let category_id = e.currentTarget.dataset.category_id || '';
    let arr = this.returnArr();
    
    arr[0].store_url = 'nearby/list_store_new';
    arr[0].store_area = this.data.store_area || '';
    arr[0].store_street = this.data.store_street || '';
    arr[0].category_name = this.data.category_name || '';
    arr[0].category_id = this.data.category_id || '';
        
    if (category_name != '') {
      arr[0].category_name = category_name;
      arr[0].category_id = category_id;
      this.data.category_name = category_name;
      this.data.category_id = category_id;
      
      if (category_name=='全部'){
        category_name = this.data.category_name
      }
      this.setData({
        activeIndex1: index,
        category_name,
        category_id,
        store_url: arr[0].store_url
      })
    }

    if (near_name != '') {
      
      if (near_name.search("-") != -1 ){
        let temp = near_name.split('-');
        arr[0].store_area =temp[0];
        arr[0].store_street = near_name;
        this.data.store_area = temp[0];
        this.data.store_street = near_name;
      }

      this.setData({
        nactiveIndex1: index,
        near_name,
      })
    }

    if (sort != '') {
      arr[0].sort = sort;
      this.setData({
        sort
      })
    }

    this.getData(this, arr[0]);
    this.setData({
      isShowFruit: false, onOff1: false, onOff2: false, onOff3: false,
    })
  },
  // 防止穿透
  returnTap() { return},
  touchHandler: function () {
    this.setData({
      isShowFruit: false, onOff1: false, onOff2: false, onOff3: false,
    })
    return;
  },
  getData: function (me, arr) {
    console.log('getData')
    let that = me;
    var myDate = new Date();
    var timestamp = Date.parse(myDate);
    let date = myDate.toLocaleDateString().replace(/\//g, '-');  

    let globalKey = wx.getStorageSync('globalKey');  
    let gram = this.returnGram();

    wx.request({
      url: app.globalData.url + '/api/' + arr.store_url,
      method: "POST",
      data: {
        request_object: app.globalData.request_object,
        user_id: globalKey.user_id || '',
        store_city: arr.store_city,
        store_street: arr.store_street || '',
        store_area: arr.store_area || '',
        store_name: arr.store_name || '',
        latitude: arr.latitude,
        longitude: arr.longitude,
        page: arr.page || 1,
        category_id: arr.category_id || '',
        sec_category_id: arr.sec_category_id || '',
        distance: arr.distance || '',
        sort: arr.sort || '',
        is_recommend: arr.is_recommend || 0,

        date: date,
        limit: 10,
        timestamp,
        process: gram.process,
        token: gram.token,
      },
      success: function (res) {
        console.log('class', res)
        if (res.data.status == '1') {
          let num = [];
          let half = 0;
          let newData = util.addUrl(res.data.data, 'store_logo');
          if (newData.length > 0) {
            let stores = [];

            if (arr.page == 1) {
              stores = [];
            } else {
              stores = that.data.stores;
            }
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
              page: arr.page || 1,
              num,
              isLoad:true,
              half
            })
          } else {
            if (arr.page > 1) {
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
    let page = this.data.page;

    let arr = this.returnArr();
    arr[0].store_url= this.data.store_url;
    arr[0].category_id= this.data.category_id || "";
    arr[0].category_name= this.data.category_name || "";
    arr[0]. near_name= this.data.near_name || "";
    arr[0].sort= this.data.sort || "";

    if (this.data.isAdd) {
      this.data.isAdd = false;
      page++;
      arr[0].page = page;
      this.getData(this, arr[0]);
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