// pages/businessQualification/businessQualification.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      businessQualification:[],
      pics:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      wx: wx.request({
          url: 'https://exbuy.double.com.cn/api/store_detail/get_business_info',
        data: {
          request_object: app.globalData.request_object,
          store_id :app.globalData.store_id || wx.getStorageSync('store_info').store_id
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
              console.log(res.data.data);
              if (!res.data.data){
                  return;
              }
              var list_pic;
              var data = res.data.data;
              var list_pic = data.list_pic;   
              var array =new Array();    
              console.log(list_pic);
              for(var i=0;i<list_pic.length;i++){
                  list_pic[i]["pic"] = app.formatImg(list_pic[i]["pic"]);   
                  array.push(list_pic[i]["pic"]);
                  console.log(list_pic[i]["pic"]);
              }
              data.list_pic = list_pic;
            that.setData({
                businessQualification: data,
                pics:array
            })
             
          },
          fail: function (res) { },
          complete: function (res) { },
      })
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