// pages/localtion/localtion.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
    
    },
    localtion:function(e){
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
                    success: function (res) {
                    },
                    fail: function () {

                    },
                    complete: function () { }
                })
            },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
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