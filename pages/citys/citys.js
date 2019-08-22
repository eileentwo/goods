
var amap = require('../../utils/amap-wx.js');
var md5 = require('../../utils/md5.js');
var app = getApp();
var wxMarkerData = [];
Page({
  data: {
    titlename:'定位',
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    localH: true,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "",
    isSelect:false,
    hotcityList: []
  },
  onLoad: function (option) {
    // 生命周期函数--监听页面加载
    var that = this;
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    console.log('citys',option)

    if(option.city==''){

      wx.showLoading({
        title: '加载中',
      })
      wx: wx.getLocation({
        type: 'gcj02',
        altitude: true,
        success: function (res) {
          console.log(res)

          var myAmapFun = new amap.AMapWX({ key: 'd909b59416287f4eeecfd7f57d4251c4' });
          myAmapFun.getRegeo({
            location: '' + res.longitude + ',' + res.latitude + '',
            success: function (data) {

              //成功回调
              let city = data[0].regeocodeData.addressComponent.city;
              that.city = city
              wx.hideLoading();
              that.setData({ city })
            },
            fail: function (info) {
              //失败回调
              console.log(info)
              wx.showLoading({
                title: 'myAmapFunW',
              })
            }
          })

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      that.setData({ city:option.city })
    }
    let localData = wx.getStorageSync('localData') || [];
    // console.log(localData)
    if (localData.length==0){
      that.getLocalData('list_city', winHeight)
     
    }else{
      // console.log(localData, 7999)
      that.setLocalData(winHeight, localData);
    }

  },
  getLocalData: function (urlName, winHeight){
    var that=this;
    var timestamp = Date.parse(new Date());
    var val = 'fanbuyhainan' + timestamp.toString();
    var process = md5.hexMD5(val);
    let city ='';
    if (that.data.isSelect) {
      city=that.value;
    }else{
      city =that.city || that.data.city;
    }
    wx.request({
      url: app.globalData.url + "/api/mini_homepage/" + urlName,
      method: "POST",
      data: {
        request_object: app.globalData.request_object,
        process,
        timestamp,
        city,
      },
      success: function (res) {
        console.log(res, res.data.status);
        //  请求到数据 存在本地
        if (res.data.status == 1) {
          let data = res.data.data;
          if (urlName == 'list_city') {
            if (winHeight) {
              wx.hideLoading();
              that.setLocalData(winHeight, data);
            }else{

            }
          } else if (urlName =='list_area'){
            that.setData({
              nextLocal: res.data.data
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
  setLocalData: function (winHeight, data) {
    // console.log(data.list_letter,103)
    var that = this;
    var searchLetter = [];
    var tempObj = [];
    let itemH = data.list_letter.length;

    for (var i = 0; i < itemH; i++) {
      var temp = {};
      temp.name = data.list_letter[i].letter;
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    console.log(data, data.list_hot, itemH, winHeight)
    wx.setStorageSync('localData', data);
    that.setData({
      cityList: data.list_letter,
      itemH,
      hotcityList: data.list_hot,
      searchLetter: tempObj,
      winHeight: winHeight,

    })
  },
  // 切换区县
  changeLocal:function(){
    let that=this;
    let localH = this.data.localH;
    localH = !localH;

    // console.log(that.city, that.data.city)
    if (!localH) {
      that.getLocalData('list_area')
     
    }
    this.setData({
      localH
    })

  },
  inputup: function (e) {
    this.value=e.detail.value
  },
  select: function () {
    let selectCity = this.value;
    let isSelect=false
    let localData = wx.getStorageSync('localData') || [];
    console.log(selectCity,localData)

    if (selectCity ){
      isSelect = true;
      if (localData.length == 0) {
      // this.getLocalData('list_city',this.data.winHeight);
      }else{
        let tempList=[];
        let arr=[]
        for (let i = 0; i < localData.list_letter.length;i++){
           
          for (let j = 0; j < localData.list_letter[i].list_city.length;j++){

            tempList.push(localData.list_letter[i].list_city[j].city)
          }
        }
        for(let i=0;i<tempList.length;i++ ){
          if (tempList[i].indexOf(selectCity) >= 0){
            arr.push(tempList[i])
          }
        }
        console.log(arr)
        this.setData({
          result: arr
        })
      }
    }else{
      wx.showToast({
        title: '该城市暂未开通服务！',
      })
      isSelect=false;
    }
    this.setData({ isSelect})
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  clickLetter: function (e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  bindCity: function (e) {
    console.log("bindCity")
    let city = e.currentTarget.dataset.city;

    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];  
    console.log(prevPage)
    prevPage.setData({ curCity: city,status:1 })

    wx.navigateBack({

      delta: 1  // 返回上一级页面。


    })
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  }
})