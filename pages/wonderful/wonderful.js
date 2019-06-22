//index.js
//获取应用实例
//设置启动点
var startPoint;
//设置启动点
const app = getApp()

// http://wxtest.jxbw.com/video/video.mp4

Page({
  data: {
    buttonTop: app.globalData.finalTop,
    buttonLeft: app.globalData.finalLeft,
    windowHeight: '',
    windowWidth: '',
     switchURL: '../../imgs/shishi.png',
    list: [],
    videoBegin:'../../imgs/videoBegin.png'

  },
  //事件处理函数
  bindViewTap: function (event) {
    console.log(event)
  },
  test_yun: function () {

  },
  onReady: function () {
    //获得dialog组件
    this.switch = this.selectComponent("#switch");
  },
  onLoad: function () {
   let that = this;
   wx.request({
     url: app.globalData.localhost + '/tlgklw/tl_interface/service/dataservice/siteVideoData?useId=' + app.globalData.openId,
     success(res){
        console.log(res);
        that.setData({shareData:res.data.data})
      let wonderfulArr = [];
      for(let i = 0 ; i< res.data.data.length ; i++){
        if (res.data.data[i].ISFLAG == 'true'){
          wonderfulArr.push({
            src: app.globalData.localhost + "/tlgklw/tl_core/servlet/videoImgServlet?videoId=" + res.data.data[i].SHORTVIDEOID,
            iconSrc: ["../../imgs/location.png",
              "../../imgs/player.png",
              "../../imgs/liked.png",
              "../../imgs/share.png"
            ],
            text: res.data.data[i].SITENAME,
            playNumbers: res.data.data[i].PLAYNUMBERS,
            shareNumbers: res.data.data[i].SHARENUMBERS,
            likedNumbers: res.data.data[i].THUMBERNUMBER,
            sideId: res.data.data[i].SITEID,
            sideName: res.data.data[i].SITENAME,
            textDecoration: res.data.data[i].SITEREMARK,
            shortVideoId: res.data.data[i].SHORTVIDEOID
          })
        }else{
          wonderfulArr.push({
            src: app.globalData.localhost + "/tlgklw/tl_core/servlet/videoImgServlet?videoId=" + res.data.data[i].SHORTVIDEOID,
            iconSrc: ["../../imgs/location.png",
              "../../imgs/player.png",
              "../../imgs/like.png",
              "../../imgs/share.png"
            ],
            text: res.data.data[i].SITENAME,
            playNumbers: res.data.data[i].PLAYNUMBERS,
            shareNumbers: res.data.data[i].SHARENUMBERS,
            likedNumbers: res.data.data[i].THUMBERNUMBER,
            sideId: res.data.data[i].SITEID,
            sideName: res.data.data[i].SITENAME,
            textDecoration: res.data.data[i].SITEREMARK,
            shortVideoId: res.data.data[i].SHORTVIDEOID
          })
        }
  
      };
       that.setData({ list: wonderfulArr});


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
  switchChange:function(){ //switch到直播
    this.switch.routerToZhiBo();
  },
  changeToStationPage:function(e){
    wx.navigateTo({
      url: '../stationPage/stationPage?sideId=' + this.data.list[e.currentTarget.dataset.index].sideId + '&sideName=' + this.data.list[e.currentTarget.dataset.index].sideName,
    })
  },
  //跳转到近三天视频
  gotoThreeDay:function(e){
    console.log(1);
    console.log(e);
    wx.navigateTo({
      url: '../threeDays/threeDays?sideId=' + this.data.list[e.currentTarget.dataset.index].sideId + '&sideName=' + this.data.list[e.currentTarget.dataset.index].sideName,
    })
  },
  //分享此页面
  onShareAppMessage: function () {
    //传stationPage的短视频id
      return {
        title: '高空瞭望小程序',
        path: 'pages/wonderful/wonderful',
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
          wx.request({
            url: 'http://localhost:8080/tlgklw/tl_interface/service/dataservice/shareVideo',
            method: "POST",
            data: {
              shortVideoId: that.data.nowVideoSrc
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          })
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
  },
  share:function(e){
    let that = this;
    console.log(e.currentTarget.dataset.index);
    wx.request({
      url: app.globalData.localhost + '/tlgklw/tl_interface/service/dataservice/shareVideo',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        shortVideoId: that.data.shareData[e.currentTarget.dataset.index].SHORTVIDEOID
      },
      success(res) {
       //成功之后设置数据
       console.log(1);
       let arr = that.data.list;
       console.log(arr);
        arr[e.currentTarget.dataset.index].shareNumbers = arr[e.currentTarget.dataset.index].shareNumbers+1;
        that.setData({ list:arr});
      }
    });
  },
  //点赞
  dianzan:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.index);
    wx.request({
      url: app.globalData.localhost + '/tlgklw/tl_interface/service/dataservice/giveThumb',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        shortVideoId: that.data.list[e.currentTarget.dataset.index].shortVideoId,
        useId: app.globalData.openId,
      },
      success(res){
        console.log(res.data.data);
        let Data = that.data.list;

        if(res.data.data.ISFLAG == 'true'){
          Data[e.currentTarget.dataset.index].iconSrc = ["../../imgs/location.png",
            "../../imgs/player.png",
            "../../imgs/liked.png",
            "../../imgs/share.png"
          ];
          Data[e.currentTarget.dataset.index].likedNumbers = res.data.data.NUMBER;
          that.setData({list:Data})
          console.log(that.data.list);
        }else{
          Data[e.currentTarget.dataset.index].iconSrc = ["../../imgs/location.png",
            "../../imgs/player.png",
            "../../imgs/like.png",
            "../../imgs/share.png"
          ];
          Data[e.currentTarget.dataset.index].likedNumbers = res.data.data.NUMBER;
          that.setData({ list: Data })
          console.log(that.data.list);
        }
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
