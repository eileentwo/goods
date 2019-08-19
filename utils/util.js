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
  console.log(obj,'util')
  let re = /^\//;
  let str = 'https://exbuy.double.com.cn/';
  if (src) {
    src= src.substring(0, src.length);
    // console.log(src)
    for (let i = 0; i < obj.length; i++) {
      if (obj[i][src]) {
        obj[i][src] = obj[i][src].replace(re, str);
      }
    }
  }
  return obj
}
module.exports = {
  formatTime,
  throttle,
  addUrl
}
