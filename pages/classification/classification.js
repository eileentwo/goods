// pages/classification/classification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titlename:'分类',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      titlename: options.category_name
    })
    
  },
  getData: function (latitude, longitude) {//list_store
    console.log('getData')
    let that = this;
    let userInfokey = wx.getStorageSync('userInfokey');
    var timestamp = Date.parse(new Date());
    let token = userInfokey.token || '';
    var val = 'fanbuyhainan' + timestamp.toString() + token;
    var process = md5.hexMD5(val);
    wx.request({
      url: app.globalData.url + '/api/mini_program/list_store',
      method: "POST",
      data: {
        store_city: '厦门市',
        latitude,
        longitude,
        page: 1,
        limit: 10,
        timestamp,
        process,
        token,
        user_id: userInfokey.user_id || '',
        store_area: '',
        store_name: '',
        category_id: '',
        sec_category_id: '',
      },
      success: function (res) {
        console.log('class', res)
        if (res.data.status == '1') {
          let stores = res.data.data;

        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let homedata = wx.getStorageSync('homedata');
    console.log(62, homedata)
    let latitude = homedata.latitude;
    let longitude = homedata.longitude;
    if (homedata.longitude) {
      this.getData(latitude, longitude)
    }
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
  onShareAppMessage: function () {

  }
})