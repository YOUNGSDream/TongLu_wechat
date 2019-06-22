//app.js
App({
  globalData: {
    userInfo: null,
    localhost: 'https://wxtest.jxbw.com',
    // localhost:'https://hbsyb.booway.com.cn',
    // localhost_img: 'https://hbsyb.booway.com.cn',
    localhost_img: 'http://wxtest.jxbw.com',
    // localhost:'http://192.168.150.184:8080',
    openId:'123',
    aqiData:null,
    airLineData1:null,
    airLineData2: null,
    finalTop:0,
    finalLeft:0,
    windowHeight:0,
    windowWidth:0
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        
       
        // 设置初始时候切换直播精彩组件按钮的初始位置 ，70为其宽高
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.finalLeft = res.windowWidth-70;
        that.globalData.finalTop = Math.ceil((res.windowHeight-70)/2);
        // 设置初始时候切换直播精彩组件按钮的初始位置 ，70为其宽高
      }
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          //console.log(res.code);
          //发起网络请求,获取用户openId
          wx.request({
            url: that.globalData.localhost+'/tlgklw/tl_interface/service/dataservice/giveOpenId',
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data:{
              code:res.code
            },
            success: function (res) {
            
            let userData =  JSON.parse(res.data.data);

              that.globalData.openId = userData.openid;
              //console.log(that.globalData.openId);
            }

          })

        } else {

          console.log('获取用户登录态失败！' + res.errMsg)

        }

      }

    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
          
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  
 

})