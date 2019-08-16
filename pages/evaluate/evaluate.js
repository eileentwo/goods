var app = getApp();
var md5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');
var timestamp = Date.parse(new Date());

var key = 0;
var textcontent = '';
var check = '';
var uploadImg='';
Page({
  data: {
    titlename: '评价',
        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../images/eva/normal.png',
        selectedSrc: '../../images/selected.png',
        halfSrc: '../../images/half.png',
        check: '../../images/eva/checkno.png',
        checked: '../../images/eva/checkno.png',
        key: 0,//评分
        images: [],
        store_name:'',
        store_logo:'',
        contentCount: 0,
        value: 0,
        anonymous: 0,
        selectall: [{
            title: "环境好",
            isSelect: false
        }, {
            title: "性价比高",
            isSelect: false
        }, {
            title: "干净卫生",
            isSelect: false
        }, {
            title: "服务好",
            isSelect: false
        }, {
            title: "味道好",
            isSelect: false
        }, {
            title: "服务差",
            isSelect: false
        }]
    },
    onLoad: function () {
        // console.log("key:", halfSrc)
        this.setData({
            store_name: app.globalData.store_name,
            store_logo: app.globalData.store_logo,
        })
    },

    select(event) {
        let index = event.target.dataset.index
        this.data.selectall[index].isSelect = !this.data.selectall[index].isSelect;
        this.setData({
            selectall: this.data.selectall
        })
    },
    // 匿名事件
    anonymous: function (e) {
        if (e.detail.value == '') {
            check = 0
        }
        else {
            check = 1
        }
        console.log("wome dd,", check)
    },
    // 内容操作
    handleContentInput(event) {
        let textareaValue = event.detail.value;
        let contentCount = textareaValue.length;
        if (contentCount <= 99) {
            this.setData({
                contentCount: contentCount,
                content: textareaValue
            })
        }
        textcontent = textareaValue;
    },
    //点击右边,半颗星
    // selectLeft: function (e) {
    //     var key = e.currentTarget.dataset.key
    //     if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
    //         //只有一颗星的时候,再次点击,变为0颗
    //         key = 0;
    //     }
    //     console.log("得" + key + "分")
    //     this.setData({
    //         key: key
    //     })

    // },
    //点击左边,整颗星
    selectRight: function (e) {
        key = e.currentTarget.dataset.key;

        this.setData({
            key: key
        })
        console.log("得" + key + "分")
    },
    // 图片操作的具体函数
    ImageOperator() {
        wx.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                // 上传的图片数据
                const imgList = res.tempFilePaths;
                // 原始的图片数据
                const imageList = this.data.images;
                // 原来的图片数量
                let imageLenght = imageList.length;
                // 当前的图片数量
                let nowLenght = imgList.length;
                console.log("tupian:", imageLenght);
                if (imageLenght == 3) {
                    console.log("数量已经有9张，请删除在添加...");
                }
                if (imageLenght < 3) {
                    let images = [];
                    // 获取缺少的图片张数
                    let residue = 9 - imageLenght;
                    // 如果缺少的张数大于当前的的张数  
                    if (residue >= nowLenght) {
                        // 直接将两个数组合并为一个  
                        images = imageList.concat(imgList);
                    } else {
                        // 否则截取当前的数组一部分  
                        images = imageList.concat(imgList.slice(0, residue));
                    }
                    this.setData({
                        images
                    })
                }
                wx.getFileSystemManager().readFile({
                    filePath: res.tempFilePaths[0], //选择图片返回的相对路径
                    encoding: 'base64', //编码格式
                    success: res => { //成功的回调
                        console.log('data:image/png;base64,' + res.data)
                        uploadImg = res.data
                    }
                })
                
                console.log("imgList:", uploadImg)
            }
        })

    },
    // 图片获取
    chooseImage() {
        if (this.data.images.length == 0) {
            wx.showToast({
                title: '只能选中图片上传!',
                icon: 'none',
                duration: 2000,
                success: res => {
                    this.ImageOperator()
                }
            })
        } else {
            this.ImageOperator()
        }

    },
    // 删除图片
    deleteImage(event) {
        //获取数据绑定的data-id的数据
        const nowIndex = event.currentTarget.dataset.id;
        let images = this.data.images;
        images.splice(nowIndex, 1);
        this.setData({
            images
        })
    },
    // 预览图片
    previewIamge(event) {
        const nowIndex = event.currentTarget.dataset.id;
        const images = this.data.images;
        wx.previewImage({
            current: images[nowIndex],  //当前预览的图片
            urls: images,  //所有要预览的图片
        })
    },
    // 重置表单
    // resetClick() {
    //     wx.showModal({
    //         title: '警告',
    //         content: '重置表单将需要重新上传数据',
    //         success: res => {
    //             if (res.confirm) {
    //                 this.setData({
    //                     titleCount: 0,
    //                     contentCount: 0,
    //                     title: '',
    //                     content: '',
    //                     images: [],
    //                     video: ''
    //                 })
    //             }
    //         }
    //     })
    // },

    formSubmit: function () {
        let all = [];
        this.data.selectall.forEach((v, i) => {
            // console.log(v + i)
            if (v.isSelect) {
                all.push(v)
            }
        })
        console.log(all);
        var tags = new Array();
        for (var i = 0; i < all.length; i++) {
            tags.push(all[i]["title"])
        }
        console.log("文本域:", textcontent)
        tags = tags.join(',');
        // console.log("images:", images)
        // console.log("tags:", tags)
        // console.log("key:", key)
        // console.log("匿名否？",check);
        if (check == '' || check==null){
            check=0
        }
        console.log("匿名否？", check);
      let userInfokey = wx.getStorageSync('userInfokey');
      var store_id = app.globalData.store_id || wx.getStorageSync('store_info').store_id;

      let token = app.globalData.token || userInfokey.token;
      var val = 'fanbuyhainan' + timestamp.toString() + token;
      var hexMD5 = md5.hexMD5(val);
        wx.request({
            url: 'https://exbuy.double.com.cn/api/store_order/insert_user_evaluate',
          data: {
            request_object: app.globalData.request_object,
              user_id: app.globalData.user_id || userInfokey.user_id,
                order_id: app.globalData.order_id,
                score: key,
                store_id,
                tags: tags,
                content: textcontent,
                pics: uploadImg,
                is_anonymous: check,
                timestamp: timestamp,
              process: hexMD5,
              token: token
            },
            method: 'POST',
            success: function (res) {
                console.log(res.data)
                if (res.data.status == 1){
                    wx.showToast({
                        title: '提交成功',
                        icon:'success',
                        mask:'true',
                        duration:2000,
                        success:res=>{
                            wx.navigateBack({  
                                url: "../Paid1/Paid1",
                            });
                        }
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '提交失败',
                        success: res => {
                            wx.navigateBack({     
                                url: "../Paid/Paid",
                            });
                        }

                    })
                }
              
            },
            fail: function () {
                wx.showToast({
                    title: '服务器响应失败',
                })
            }
        })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let store_info = wx.getStorageSync('store_info');
    console.log(store_info)
    if (res.from === 'button') {
    }
    return {
      title: '转发',
      path: 'pages/orderOrPayment/orderOrPayment?store_id=' + store_info.store_id + '&store_name=' + store_info.store_name,
      success: function (res) {

      }
    }

  },
})
