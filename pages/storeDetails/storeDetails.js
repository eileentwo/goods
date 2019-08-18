var app = getApp();
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');

var data_list = new Array();
var category_list = new Array();
var good_list = new Array();
var discount_id = null;
var store_id = '';
var user_id='';
var orderName = "";
var orderNum = "";
var orderCost = "";
var goodsItem = [];
// 右侧每一类的 bar 的高度（固定）
const RIGHT_BAR_HEIGHT = 30;
// 右侧每个子类的高度（固定）
const RIGHT_ITEM_HEIGHT =110;
// 左侧每个类的高度（固定）
const LEFT_ITEM_HEIGHT = 42     
 
Page({ 
  data: {
    titlename: '店铺详情',
    longitude: "",
    latitude: "",
    adress: "",
    adressName: "",
    currentTab: 0,//优惠商品，用户评价，温馨提示面板切换
    menuTapCurrenta: 3,
    showModalStatus: false, //是否显示拨打商家电话面板
    tabArr: { //左侧选项卡
      curHdIndex: 0,
      curBdIndex: 0
    },
    imgUrls: [],
    tips: [],
    store_score: '',//店铺评分
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/storeDetails/normal.png',
    selectedSrc: '../../images/storeDetails/selected.png',
    halfSrc: '../../images/storeDetails/half.png',
    distance: "1.2km",
    viewClassName: 'productImage',
    foodList: [], //商品信息
    goodsType: [],
    
    orderCost: 0, //订餐消费
    orderName: '',
    orderList: {},
    oli: [],
    goods_pics: "",
    storeDetails: [],
    list_type: [],
    list_tag: [],
    list_evaluate1: [],//评论
    evaHeadPic: [],
    evaPics: [],
    goods_id: 0,
    discountDe: [],//折扣详情
    discountId: [],//具体的折扣id
    currentGoodsType: null, //当前左侧选择项名称
    currentGoodsTypeIndex: null, //当前左侧选择项所属下标
    business: true,//是否营业
    swiperCurrent: 0,// 当前轮播页码
    totalSwiper: 0,//总页码
    goods_movedTop:'0',
    // 左边栏
    itemTopArray: [],
    isContentCanFloat: [],
    isAddItemTopArray: true,
    isCategoryItemTap: false,
    categoryBoxScrollIntoView: 0,
    
    cartBoxStatus:false,//是否查看已经点商品
    catBoxtop:0,    
    total_num:0,//已经选择了多少商品的总数量
    goods_selenum:0,
    noGood:false,
    order_cost:0,//订单总价
    tempTop:0,
    isMask:false,


    //swiper滑动的数组
    swiper_ID: 0,

    // 左 => 右联动 右scroll-into-view 所需的id
    toView: null,
    // 当前左侧选择的
    currentLeftSelect: null,
    // 右侧每类数据到顶部的距离（用来与 右 => 左 联动时监听右侧滚动到顶部的距离比较）
    eachRightItemToTop: [],
    leftToTop: 0
  },
  onLoad: function (options) {
    console.log(7888, wx.getStorageInfoSync('userInfokey'), options)
    let store_info = wx.getStorageSync('store_info')
    store_id = options.store_id;
    user_id = options.user_id;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 3000)
    var that = this;
    // 店铺详情

    var list = store_info.list_store_pics
        list = util.addUrl(list) ;
    // console.log(list)
    var array1 = new Array();
    var tips = store_info.list_tips;
    for (var index in tips) {
      array1.push(tips[index].tips);
    }
    //判断是否在当前营业时间内
    let business_hours = store_info.business_hours.split('-');
    that.time_range(business_hours[0], business_hours[1])
    // console.log(105,list)
    that.setData({
      storeDetails: store_info,
      imgUrls: list,
      totalSwiper: list.length,
      tips: array1,
      store_score: store_info.store_score,
      isMask:false,
    })


    //商品列表
    let choosedList = wx.getStorageSync('choosedList') || [];
    let order_info = wx.getStorageSync('order_info') || {};
    goodsItem = wx.getStorageSync('goodsItem') ;
    goodsItem = util.addUrl(goodsItem)
    // console.log(goodsItem,1333)
    if (choosedList.length > 0 || wx.getStorageInfoSync('goodsItem').length>0){
      for (let i = 0; i < choosedList.length;i++){
        for(let j=0;j<goodsItem.length;j++){
          let list_goods = goodsItem[j].list_goods;
          goodsItem[j].select_nums=0
          for (let k = 0; k < list_goods.length;k++){
            if (choosedList[i].goodsid == list_goods[k].goods_id){
              list_goods[k].num = choosedList[i].goods_selenum;
              goodsItem[j].select_nums+= choosedList[i].goods_selenum;
            }
          }
        }
      }
    }
    let totalCont = goodsItem.length;
    if (goodsItem && totalCont > 0) {
      
      for(let i=0;i<totalCont;i++){
        for (let j = 0; j < goodsItem[i].list_goods.length;j++){
          ////console.log(goodsItem[i].list_goods[j].stock_count > 0,138)
          if (goodsItem[i].list_goods[j].stock_count>0){
            that.data.noGood = true;
          }else{
            that.data.noGood = false;
          }
        }
      }
      that.localtion(1);//获取当前位置与店家之间的距离
      that.setData({
        total_num: order_info.total_num,
        order_cost: order_info.order_cost,
        goodsItem,
        noGood: that.data.noGood,
        choosedList
      })
    }
    wx.createSelectorQuery().select('#storeDetails').boundingClientRect(function (rect) {
      that.data.rectT = rect.top;
      console.log(that.data.rectT)
    }).exec();


    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight;
        that.data.sysHeight = clientHeight-44;
        that.setData({
          tab1h: that.data.sysHeight
        })
      },
    })
    that.setData({
      currentLeftSelect: goodsItem[0].id,
      tcategory: goodsItem[0].category,
      tintroduce: goodsItem[0].introduce,
      eachRightItemToTop: this.getEachRightItemToTop()
    })
  },
 
  onPageScroll: function (e) {
    let that = this
    let scrollT = 0;
    if (e.scrollTop <200){
      scrollT = -e.scrollTop;

      // that.setData({
      //   goods_movedTop: scrollT,
      // })
    }
  },

  swiperChange: function (e) {
    console.log(205,e)
    let index = e.detail.index
    if (e.detail.source == 'touch') {
      this.setData({
        swiperCurrent: e.detail.current,
        
      })

    }
  },
  toPay:function (e) {
    let that = this;
    // 判断是否有选中商品
    if (this.data.total_num > 0) {
      var choosedList = wx.getStorageSync('choosedList') || that.data.choosedList;  
        var discount_goods = new Array();
        var activity_goods = new Array();
        let userInfokey = wx.getStorageSync('userInfokey');
      console.log(userInfokey,229)
        for (var item in choosedList) {
            var obj1 = {
              goods_id: choosedList[item]["goodsid"],
              goods_num: choosedList[item]["goods_selenum"],
              goods_type: choosedList[item]["goods_type"],
            }
            discount_goods.push(obj1)
          // }
        }

      wx.setStorageSync('ol', choosedList);
       
       // ------------------------------
        // var activity_goods = JSON.stringify(activity_goods);
        var discount_goods = JSON.stringify(discount_goods);
        // app.globalData.activity_goods = activity_goods;
        app.globalData.discount_goods = discount_goods;
      // var store_id = wx.getStorageSync('store_info').store_id;
      var timestamp = Date.parse(new Date());
      let token = app.globalData.token || userInfokey.token;
      var val = 'fanbuyhainan' + timestamp.toString() + token;
      var hexMD5 = md5.hexMD5(val);
        // 生成订单号
        wx: wx.request({
          url:app.globalData.url+'/api/store_detail/insert_order_new',
          data: {
            request_object: app.globalData.request_object,
            user_id:user_id || userInfokey.user_id ,
            store_id,
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
            console.log(token,243,userInfokey,'生成订单号', res)
            if (res.data.status == 1) {
              that.setData({
                actual_money: res.data.data.actual_money, isMask:true
              })
              // 订单号
              userInfokey.order_id = res.data.data.order_id
              // 订单金额
              userInfokey.account_money = res.data.data.account_money
              // 翻倍金额
              // ////console.log("翻倍金额", res.data.data.discount_price)
              userInfokey.discount_price = res.data.data.discount_price
              // 服务费用
              // ////console.log("服务费用", res.data.data.service_money)
              userInfokey.service_money = res.data.data.service_money
              // 本单节省
              // ////console.log("本单节省", res.data.data.save_money)
              userInfokey.save_money = res.data.data.save_money
              // 未翻金额
              // ////console.log("未翻金额", res.data.data.no_discount_price)
              userInfokey.no_discount_price = res.data.data.no_discount_price
              userInfokey.actual_money = res.data.data.actual_money
              wx.setStorageSync('userInfokey', userInfokey)
              wx.navigateTo({
                url: '../submitOrders/submitOrders?store_id=' + store_id + '&user_id=' + user_id
              });
            } else {
              if (res.data.message){

                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000,
                })
              }
            }
          },
          fail: function () {
            // fail
            console.log("服务器响应失败");
            wx.showToast({
              title: '服务器响应失败',
              icon: 'none',
              duration: 2000,
            })
          },
          complete: function () {
            // complete
          },

        })
    } else {
      wx.showToast({
        title: '请先选购商品',
        icon: 'none',
        duration: 1000
      })
    }
  },

  // 打开定位地图

  localtion(num) {
    let me=this;
    if (num == 1) { 
      wx: wx.getLocation({
        type: 'gcj02',
        altitude: true,
        success: function (res) {
          //console.log(299,res)
          var latitude = res.latitude;
          var longitude = res.longitude;
          let store_info = wx.getStorageSync('store_info');
          let store_latitude = store_info.store_latitude;
          let store_longitude = store_info.store_longitude;
          let disance = Number(me.getDistance(latitude, longitude, store_latitude, store_longitude)).toFixed(1);
          me.setData({
            disance
          })
          
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx: wx.getLocation({
        type: 'gcj02',
        altitude: true,
        success: function (res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28,
            success: function (res) { },
            fail: function () {
            },
            complete: function () { }
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  }, 
  getDistance(lat1, lng1, lat2, lng2){
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  },

  
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  // 查看已选择的商品
  openCart:function(e){
    let num = e.currentTarget.dataset.num;
    if (num>0){
      ////console.log(this.data.sysHeight -160 - 90 * num, this.data.catBoxtop,471)
      this.setData({
        cartBoxStatus:true,
        catBoxtop: this.data.sysHeight - 160 - 90 * num,
      })
    }
  },
  // 清空购物车里的所有东西
  deleFn: function (data) {
    
    if (this.data.total_num>0){
      
      let goodsItem = wx.getStorageSync('goodsItem');

      for (var i in goodsItem) {
        goodsItem[i].select_nums=0;
        for (var j in goodsItem[i].list_goods){
          goodsItem[i].list_goods[j].num=0;
        }
        
      }
      wx.setStorageSync('goodsItem', goodsItem);
      let order_info= [];
      let  choosedList=[];
      wx.setStorageSync('choosedList', choosedList);
      wx.setStorageSync('order_info', order_info);
      this.setData({
        total_num:0,
        cartBoxStatus:false,
        order_cost:0,
        goodsItem,
        choosedList,
        order_info
      });
    }
  },
  util: function (currentStatu) {
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
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      wx.createSelectorQuery().select('#cartBox').boundingClientRect(function (rect) {
        ////console.log(rect, 489)
        
      }).exec();
      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false,
        });
      } else if (currentStatu == "car"){
        this.setData({
          cartBoxStatus: false,
        })
      }
    }.bind(this), 200)
    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true,
      });
    } else if (currentStatu == "caropen") {
      this.setData({
        cartBoxStatus:true,
      });
    }
  },
  to_call: function () { //拨打手机号码
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },
  to_call_landline: function () {
    wx.makePhoneCall({ //拨打座机号码
      phoneNumber: this.data.landline
    })
  },
  getdata: function (category, isloaded) {
    var fl = new Object();
    if (!category) {
      return fl;
    }
    if (!data_list || data_list.length <= 0) {
      return fl;
    }
    if (!category_list || category_list.length <= 0) {
      return fl;
    }
    for (var i = 0; i < category_list.length; i++) {
      // ////console.log(category + '=>' + category_list[i]);
      if (category == category_list[i]) {
        for (var j = 0; j < data_list.length; i++) {
          if (category == data_list[i]["category"]) {
            var ob = {
              currentGoodsType: category,
              currentGoodsTypeIndex: i
            }
            // data_list[i]["list_goods"] =ob;
            var obj = data_list[i]["list_goods"];
            if (isloaded == false) {
              this.setData({
                currentGoodsTypeIndex: i,
                currentGoodsType: category
              });
              var _obj = {};
              _obj.curHdIndex = i;
              _obj.curBdIndex = i;
              this.setData({
                tabArr: _obj
              });
              // ////console.log("已设置currentGoodsTypeIndex、curBdIndex => " + i);
              // ////console.log("6666", ob);
            }
            return obj;
          }
        }
      }
    }


  },
  //增加数量
  addToCart: function (e) {
    var dataset = e.currentTarget.dataset;
    // //console.log(473, dataset)
    if (dataset.goods_count > dataset.goods_selenum){
      this.changeNum(dataset, true);
    }else{
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
      })
    }
    
  },
  //减少数量
  reduceFromCart: function (e) {
    var dataset = e.currentTarget.dataset;
    //console.log(dataset,487)
    if (dataset.goods_selenum>0){
      this.changeNum(dataset, false);
    }
    

  },
  // 改变数量
  changeNum: function (dataset, bool) {
    let choosedList = this.data.choosedList;
    let index =dataset.index;
    let goodindex =dataset.goodindex;
    let goodsItem = this.data.goodsItem;
    let curGood = goodsItem[index];
    // console.log(goodsItem, 563, index, dataset)
    let curGoodInfo = curGood.list_goods[goodindex];
    let isInArray = this.isInArray(choosedList, dataset.goodsid);
  
    if (choosedList.length>0){//判断是否有点过
      if (bool) {//当点击的是增加数量时
        if (isInArray) {
          // console.log(522, isInArray)
          choosedList[isInArray - 1].goods_selenum += 1;
        } else {
          dataset.goods_selenum += 1
          choosedList.push(dataset)
        }
        if (curGoodInfo.num){
          curGoodInfo.num += 1;
        }else{
          curGoodInfo.num = 1
        }
      } else {//当点击的是减少数量时
        //console.log(dataset.goods_selenum,5281111)
        if (dataset.goods_selenum > 0) {
          choosedList[isInArray - 1].goods_selenum -= 1
          curGoodInfo.num -= 1;
        } 
        if (dataset.goods_selenum == 1){
          choosedList.splice(isInArray - 1, 1);
        }
      }
    } else {
      // console.log(632)
      choosedList.push(dataset);
      choosedList[0].goods_selenum += 1;
      curGoodInfo.num = 1;
    }
    //计算总价
    var order_info = {};
    order_info.order_cost = 0;
    order_info.total_num = 0;

    let select_nums=0;
    for (let i in curGood.list_goods){
      select_nums += curGood.list_goods[i].num
    }
    curGood.select_nums = select_nums;

    // console.log(choosedList, 654)
    for (let k in choosedList) {
      order_info.total_num += choosedList[k].goods_selenum;
      order_info.order_cost += choosedList[k].discount_price * choosedList[k].goods_selenum; //计算总价
    }
    if (order_info.total_num==0){
      this.data.cartBoxStatus=false
    }
    this.setData({
      cartBoxStatus: this.data.cartBoxStatus,
      total_num: order_info.total_num,
      order_cost: order_info.order_cost,
      goodsItem: goodsItem,
      choosedList: choosedList,
    })
    
    wx.setStorageSync('order_info', order_info);
    wx.setStorageSync('choosedList', choosedList);
    wx.setStorageSync('goodsItem', goodsItem);
    
  },
  // 判断是否有在数组内
  isInArray(arr, value) {

    //console.log(577, arr, value)
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i].goodsid) {
        return i+1;
      }
    }
    return false;
  },
  // 点击区域转到对应的商品区
  click: function (e) {

  },
  // 全部评价
  menuTap: function (e) {
    var that = this
    this.setData({
      currentTab: e.target.dataset.tab
    });
    
  },
    // 获取全部评论
  getEvaluate() {
    var that = this
    // var store_id = app.globalData.store_id || wx.getStorageSync('store_info').store_id;
    wx.request({
      url:app.globalData.url+'/api/store_detail/list_user_evaluate',
      data: {
        store_id,
        type: 0//全部
      },
      method: 'POST',
      header: {
        'Content-Type': "application/x-www-form-urlencoded"
      }, // 设置请求的 header
      success: function (res) {
        // console.log(709, res)
        if (res.data.status == 1) {
          let evaluate = res.data.data;
          that.data.evaluate = evaluate;
          that.setData({
            len: evaluate.list_evaluate.length,
            list_type: evaluate.list_type,
            list_tag: evaluate.list_tag,
            list_evaluate: evaluate.list_evaluate,
          })
          that.evaluatefn(that.data.menuTapCurrenta);
          wx.setStorageSync('evaluate', evaluate);

        } else {
          wx.showToast({
            title: '数据加载失败',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '服务器响应失败',
          icon: 'none',
          duration: 2000,
        })
      },
      complete: function () {
        // complete
      }
    })
  },
  // 评价
  evaluatefn: function (e) {
    //console.log(e)
    var current = 0;
    if(e==3){
      current =e
    }else{
      current = e.currentTarget.dataset.current;//获取到绑定的数据
    }
   
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    
    var that = this;
    let evaluate = wx.getStorageSync('evaluate') || that.data.evaluate;
    let evaluate_list = evaluate.list_evaluate;
    let templist=[];
    
    for (let i = 0; i < evaluate_list.length;i++){

      if (evaluate_list[i].pics !='' && current == 0) {
        templist.push(evaluate_list[i])

      } else if (evaluate_list[i].score == 5 && current == 1) {
        templist.push(evaluate_list[i])
      }
      else if (evaluate_list[i].score == 1 && current == 2) {
        templist.push(evaluate_list[i])
      }
    }
    if (current == 3) {
      templist = util.addUrl(evaluate_list) 
    }
    let len = templist.length;
    console.log(700,templist, evaluate_list)
    this.setData({
      len: len,
      menuTapCurrenta: current,
      list_evaluate1: templist,
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { 
    // oldPosition category-contents-item-0storeDetails
    ////console.log(871)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isMask: false,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.hideNavigationBarLoading()//完成停止加载
      wx.stopPullDownRefresh()//停止下拉刷新
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) { 
    // let store_info = wx.getStorageSync('store_info'); 
    console.log(store_info)
    if (res.from === 'button') { 
    } 
    return {
       title: '转发', 
      path: 'pages/orderOrPayment/orderOrPayment?store_id=' + store_id + '&store_name=' + store_info.store_name,
        success: function (res) { 
        
    } }

  },

  time_range: function (beginTime, endTime) {
    var strb = beginTime.split(":");
    // if (strb.length != 2) {
    //   return false;
    // }

    var stre = endTime.split(":");
    ////console.log(924, stre.length, beginTime)
    // if (stre.length != 2) {
    //   return false;
    // }

    var b = new Date();
    var e = new Date();
    var n = new Date();

    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);

    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
      this.setData({
        business: true
      })
    } else {
      ////console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，不在该时间范围内！");
      this.setData({
        business: false
      })
    }
  },
  // 剩余百分比
  percent(info) {
    let per = '';
    for (let i = 0; i < info.length; i++) {
      info[i].per = Math.round(info[i].stock_count) / Math.round(info[i].goods_count)
    }

  },
  // 优惠商品，用户评价，温馨提醒切换
  changeTab: function (e) {
    ////console.log(114)
    var scrollLeft = ((e.detail.current + 1) - 3) + 1;
    if (scrollLeft < 0) {
      scrollLeft = 0;
    }
    this.setData({
      scrollLeft: scrollLeft * (this.data.windowWidth / 3),
      currentTab: e.detail.current
    });

    this.getEvaluate();
  },
  navigator() {
    wx.navigateTo({
      url: '../businessQualification/businessQualification?store_id=' + store_id + '&user_id=' + user_id
    })
  },

  report() {
    wx.navigateTo({
      url: '../reportBusiness/reportBusiness?store_id=' + store_id + '&user_id=' + user_id,
    })
      
  },



  // 获取每个右侧的 bar 到顶部的距离，用来做后面的计算。
  getEachRightItemToTop: function () {
    var obj = {};
    var totop = 0;
    // 右侧第一类肯定是到顶部的距离为 0
    obj[goodsItem[0].id] = totop
    // 循环来计算每个子类到顶部的高度
    for (let i = 1; i < (goodsItem.length + 1); i++) {
      console.log(goodsItem[i - 1])
      totop += (RIGHT_BAR_HEIGHT + goodsItem[i - 1].list_goods.length * RIGHT_ITEM_HEIGHT)
      // 这个的目的是 例如有两类，最后需要 0-1 1-2 2-3 的数据，所以需要一个不存在的 'last' 项，此项即为第一类加上第二类的高度。
      obj[goodsItem[i] ? goodsItem[i].id : 'last'] = totop
    }
    return obj
  },
  // 监听右侧的滚动事件与 eachRightItemToTop 的循环作对比 从而判断当前可视区域为第几类，从而渲染左侧的对应类。
  right: function (e) {
    for (let i = 0; i < this.data.goodsItem.length; i++) {
      let left = this.data.eachRightItemToTop[this.data.goodsItem[i].id]
      let right = this.data.eachRightItemToTop[this.data.goodsItem[i + 1] ? this.data.goodsItem[i + 1].id : 'last']
      if (e.detail.scrollTop < right && e.detail.scrollTop >= left) {
        // console.log(this.data.goodsItem[i].category)
        this.setData({
          currentLeftSelect: this.data.goodsItem[i].id,
          leftToTop: LEFT_ITEM_HEIGHT * i,
          tcategory: this.data.goodsItem[i].category,
          tintroduce: this.data.goodsItem[i].introduce
        })
      }
    }
  },
  // 左侧类的点击事件，点击时，右侧会滚动到对应分类
  left: function (e) {
    console.log(e)
    this.setData({ 
      toView: e.currentTarget.id || e.currentTarget.dataset.id,
      currentLeftSelect: e.currentTarget.id || e.currentTarget.dataset.id,
      tcategory: e.currentTarget.tcategory || e.currentTarget.dataset.tcategory,
      tintroduce: e.currentTarget.tintroduce || e.currentTarget.dataset.tcategory
    })
  },

})