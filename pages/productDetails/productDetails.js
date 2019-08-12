var app=getApp();
var goods_id = null;
Page({
    data: {
        imgUrls: [],
        goodsDetails:[],
        goods_id:null,
        list_type: [],
        list_tag: [],
        list_evaluate: [],
        evaHeadPic: [],

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (!options && !options.goods_id){
            return;
        }
        goods_id= options.goods_id;
        wx.request({
            url: 'https://exbuy.double.com.cn/api/store_detail/get_goods_info',
            data: {
                goods_id: goods_id
            },
            method: 'POST', 
            header: {
                'Content-Type': "application/x-www-form-urlencoded"
            }, 
            success: function (res) {
                var pics = app.formatImg(res.data.data.goods_pics)
                var pictures = pics.split(',');
                for (var item in pictures){
                    pictures[item]=app.formatImg(pictures[item])
                }
                res.data.data.goods_pics=pictures
                that.setData({
                    goodsDetails: res.data.data,
                    imgUrls: res.data.data.goods_pics
                })
               
            },
            fail: function () {
                  // fail
                console.log(123);
            },
            complete: function () {
                // complete
            }
      })
      var store_id = app.globalData.store_id || wx.getStorageSync('store_info').store_id;
        wx.request({
            url: 'https://exbuy.double.com.cn/api/store_detail/list_user_evaluate',
            data: {
                store_id
            },
            method: 'POST',
            header: {
                'Content-Type': "application/x-www-form-urlencoded"
            }, // 设置请求的 header
            success: function (res) {
                console.log(res.data)
                // 获取到的评论类型
                // console.log("type",res.data.data.list_type)
                // // 获取到的评论标签
                // console.log(res.data.data.list_tag)
                // // 获取到的评论详情
                // console.log("a",res.data.data.list_evaluate)
                // var list = res.data.data.list_evaluate;
                // for (var i = 0; i < list.length; i++) {
                //     console.log("i",list[i])
                //     var pics = app.formatImg(list[i]["head_pic"]);
                //     if (list[i]["head_pic"]==pics){
                //         return list[i]["head_pic"];
                //     }
                //     if (list[i]["head_pic"] != pics){
                //         return pics;
                //     }
                    
                // }
                var array = new Array;
                var array1 = new Array;
                var list = res.data.data.list_evaluate;
                for (var i = 0; i < list.length; i++) {
                    array1.push(app.formatImg(list[i]["head_pic"]));
                    array.push(list[i])     
                }
                that.setData({
                    list_type: res.data.data.list_type,
                    list_tag: res.data.data.list_tag,
                    list_evaluate: array,
                    
                })

            },
            fail: function () {
                // fail
                console.log("获取失败");
            },
            complete: function () {
                // complete
            }
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