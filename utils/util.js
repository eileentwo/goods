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
// 处理没http的图片
function addUrl(obj, src) {
  let re = /^\//;
  let str = 'https://exbuy.double.com.cn/';
  if (src) {
    src = src.substring(0, src.length);
    for (let i = 0; i < obj.length; i++) {
      if (obj[i][src]) {
        obj[i][src] = obj[i][src].replace(re, str);
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
module.exports = {
  formatTime,
  throttle,
  addUrl,
  isInArray,
  addHistory
}
