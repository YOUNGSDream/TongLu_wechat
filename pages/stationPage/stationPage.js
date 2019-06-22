//设置启动点
var startPoint;
//设置启动点
const app = getApp();

let airLevelColorArr = ['#47E27D', '#FDE701', '#F29901', '#DE6A58', '#7B67D0', '#9B4E7B'];

function pmLevel(data){
  var pmLevel = 0;
  if(data>=0 && data<=35){
    pmLevel = 0;
  }else if(data > 35 && data <= 75){
    pmLevel = 1;
  } else if (data > 75 && data <= 115){
    pmLevel = 2;
  } else if (data > 115 && data <= 150) {
    pmLevel = 3;
  } else if (data > 150 && data <= 250) {
    pmLevel = 4;
  } else if (data > 250 && data <= 350) {
    pmLevel = 5;
  } else{
    pmLevel = 6;
  }
  return pmLevel
}

function o3Level(data){
  var o3Level = 0;
  if (data >= 0 && data <= 100) {
    o3Level = 0;
  } else if (data > 100 && data <= 160) {
    o3Level = 1;
  } else if (data > 160 && data <= 215) {
    o3Level = 2;
  } else if (data > 215 && data <= 265) {
    o3Level = 3;
  } else if (data > 265 && data <= 800) {
    o3Level = 4;
  } else if (data > 800 && data <= 1000) {
    o3Level = 5;
  } else {
    o3Level = 6;
  }
  return o3Level
}
Page({

  data: {
    buttonTop: app.globalData.finalTop,
    buttonLeft: app.globalData.finalLeft,
    windowHeight: '',
    windowWidth: '',
    switchURL: '../../imgs/shishi.png',
    iconSrc: [
      "../../imgs/like.png",
      "../../imgs/share.png",
      "../../imgs/player.png"
    ],
    isDianZan:false,
    location:'../../imgs/location.png',
    airLevelArr: [
      {
        text: '严重',
        classes:'borDer'
      },
      {
        text: '重度'
      },
      {
        text: '中度'
      },
      {
        text: '轻度'
      },
      {
        text: '良'
      },
      {
        text: '优'
      },
    ]
  },
  switchChange:function(){
    wx.reLaunch({
      url: '../index/index',
    })
  },
  onLoad:function(option){
    let that = this;
    //console.log(option);
    this.setData({sideId:option.sideId});
    this.setData({ sideLocation: option.sideName})
    //console.log(option.sideName);
    wx.setNavigationBarTitle({
      title: option.sideName
    })
    wx.request({
      url: app.globalData.localhost + '/tlgklw/tl_interface/service/dataservice/siteNewVideo?siteId=' + that.data.sideId + '&useId=' + app.globalData.openId,
      success(res){
        console.log(res.data.data);
        that.setData({ playNumber: res.data.data.video.PLAYNUMBERS});
//设置点赞icon
        if(res.data.data.video.ISFLAG == 'true'){
          that.setData({
            iconSrc: [
              "../../imgs/liked.png",
              "../../imgs/share.png",
              "../../imgs/player.png"
            ],
          })
        } else if (res.data.data.video.ISFLAG == '"false"'){
          that.setData({
            iconSrc: [
              "../../imgs/like.png",
              "../../imgs/share.png",
              "../../imgs/player.png"
            ],
          })
        }
        //设置点赞icon
        that.setData({ shareNumber: res.data.data.video.SHARENUMBERS });
        that.setData({ videoSrc: res.data.data.video.SHORTVIDEOPATH });
        that.setData({ aqiValue: res.data.data.AQI.AQI});
        that.setData({ likeNumber: res.data.data.video.THUMBERNUMBER})
        
        that.setData({ pm25BackgroundColor:airLevelColorArr[res.data.data.AQI.AQIALEVER-1]})
        //set border
        //pm width and color
        //console.log(res.data.data.AQI.PMVALUE);
        let pmValue = res.data.data.AQI.PMVALUE;
        let o3Value = res.data.data.AQI.OVALUE;

        if (pmValue == null){
          pmValue = 0
        }else{
          
        }

        if (o3Value == null) {
          o3Value = 0
        } else {

        }

        that.setData({ pm25Value: pmValue.toFixed(1) || 0 });
        that.setData({ o3Value: o3Value.toFixed(1) || 0 });
        var pmColor = pmLevel(Number(pmValue));
        var pmWidth = (pmColor+1)*17;
        //console.log(pmColor);
        that.setData({ pmLevel: airLevelColorArr[pmColor]})
        that.setData({ pmLevelWidth: pmWidth})
        //o3 width and color
        var o3Color = o3Level(Number(o3Value));
        var o3Width = (o3Color + 1) * 17;
        that.setData({ o3Level: airLevelColorArr[o3Color] });
        that.setData({ o3LevelWidth: o3Width });
        let arr = ['严重', '重度', '中度', '轻度', '良','优'];
        let arrNow = [];
        for(let i = 0 ; i < arr.length ; i++){
          arrNow.push({ text: arr[i]});
        };
        arrNow[6 - res.data.data.AQI.AQIALEVER].classes = 'borDer';
       // console.log(arrNow);
        that.setData({ airLevelArr: arrNow})
          //set border
        that.setData({ shortvideoId: res.data.data.video.SHORTVIDEOID })
      }
    })
  },
  onShow: function () {
    this.setData({
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth,
      buttonTop: app.globalData.finalTop,
      buttonLeft: app.globalData.finalLeft,
    })
  },
  onShareAppMessage:function(){
    return {
      title: '高空瞭望小程序',
      path: 'pages/stationPage/stationPage?sideId=' + this.data.sideId ,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  //分享加1
  share: function () {
    let that = this;
    //console.log(that.data);
   // console.log(that.data.shortvideoId);
    wx.request({
      url: app.globalData.localhost + '/tlgklw/tl_interface/service/dataservice/shareVideo',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        shortVideoId: that.data.shortvideoId
      },
      success(res) {
        console.log(res)
        that.setData({shareNumber:that.data.shareNumber+1})
      }
    });
  },
  //点赞获取用户unionID
  dianZan: function () {
    let that = this;
    wx.request({
      url: app.globalData.localhost+'/tlgklw/tl_interface/service/dataservice/giveThumb',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        shortVideoId: that.data.shortvideoId,
        useId: app.globalData.openId,
      },
      success(res) {
        console.log(res);
        that.setData({ likeNumber: res.data.data.NUMBER});
        if (res.data.data.ISFLAG == 'true'){
          that.setData({
            iconSrc: [
              "../../imgs/liked.png",
              "../../imgs/share.png",
              "../../imgs/player.png"
            ],
          })
        } else if (res.data.data.ISFLAG == 'flase'){
          that.setData({
            iconSrc: [
              "../../imgs/like.png",
              "../../imgs/share.png",
              "../../imgs/player.png"
            ],
          })
        }
       

        
      
      }
    })
  },
  //视频开始播放
  videoBegin: function () {
    let that = this;
    wx.request({
      url: app.globalData.localhost +'/tlgklw/tl_interface/service/dataservice/playVideo',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        shortVideoId: that.data.shortvideoId
      },
      success(res) {
        console.log(res);
        that.setData({ playNumber:that.data.playNumber+1})
      }
    })
  },
  // 拖拽事件
  buttonStart: function (e) {
    startPoint = e.touches[0]
  },
  buttonMove: function (e) {
    var endPoint = e.touches[e.touches.length - 1];
    var translateX = endPoint.clientX - startPoint.clientX
    var translateY = endPoint.clientY - startPoint.clientY
    startPoint = endPoint
    var buttonTop = this.data.buttonTop + translateY
    var buttonLeft = this.data.buttonLeft + translateX
    //判断是移动否超出屏幕
    if (buttonLeft + 70 >= this.data.windowWidth) {
      buttonLeft = this.data.windowWidth - 70;
    }
    if (buttonLeft <= 0) {
      buttonLeft = 0;
    }
    if (buttonTop <= 0) {
      buttonTop = 0
    }
    if (buttonTop + 70 >= this.data.windowHeight) {
      buttonTop = this.data.windowHeight - 70;
    }
    this.setData({
      buttonTop: buttonTop,
      buttonLeft: buttonLeft
    })
  },
  buttonEnd: function (e) {
    console.log(e);
    if (Math.ceil(this.data.windowWidth / 2) > e.target.offsetLeft && e.target.offsetTop > 90 && e.target.offsetTop < this.data.windowHeight - 130) {
      //左边吸边

      this.setData({
        buttonTop: e.target.offsetTop,
        buttonLeft: 0
      })

    } else if (Math.ceil(this.data.windowWidth / 2) < e.target.offsetLeft && e.target.offsetTop > 90 && e.target.offsetTop < this.data.windowHeight - 130) {
      //右边吸边
      this.setData({
        buttonTop: e.target.offsetTop,
        buttonLeft: this.data.windowWidth - 70
      })

    } else if (e.target.offsetTop < 90) {
      //顶部吸边
      this.setData({
        buttonTop: 0,
        buttonLeft: e.target.offsetLeft
      })
    } else {
      //底部吸边
      this.setData({
        buttonTop: this.data.windowHeight - 70,
        buttonLeft: e.target.offsetLeft
      })
    }
    app.globalData.finalTop = this.data.buttonTop
    app.globalData.finalLeft = this.data.buttonLeft
  }
// 拖拽事件
})