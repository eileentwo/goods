//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: ['../../images/cake.png','../../images/cake.png'],
    currentSwiper:0,
    nav1: [
      { 'title': '美食', src: 'food' },
      { 'title': '酒店住宿', src: 'hotel' },
      { 'title': '美容养生', src: 'beautify' },
      { 'title': '家居', src: 'residence' },
      { 'title': '休闲娱乐', src: 'Entertainment' }, 
    ],
    nav2: [
      { 'title': '中餐', src: 'Chinesefood' },
      { 'title': '快餐小吃', src: 'FastFood' },
      { 'title': '夜宵烧烤', src: 'roast' },
      { 'title': '奶茶甜品', src: 'residence' },
      { 'title': '全部', src: 'whole' }, 
    ],
    goodsItem1: ['', '李记自助餐厅', '李记自助餐厅'],
    goodsItem2: ['李记自助餐厅', '李记自助餐厅', '李记自助餐厅'],

  },
  onLoad: function () {
  
  },
  
})
