// pages/threeDays/threeDay
//设置启动点
var startPoint;
//设置启动点
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
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
    videoBegin: '../../imgs/videoBegin.png',
    location: '../../imgs/location.png',
    requestData:null,
    isDianZan:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ sideLocation: options.sideName })
    this.setData({sideId:options.sideId})
    wx.setNavigationBarTitle({
      title: options.sideName
    })
    var that = this;
    wx.request({
      url: app.globalData.localhost + '/tlgklw/tl_interface/service/dataservice/siteVideoThreeDayData?siteId=' + options.sideId + '&useId=' + app.globalData.openId,
      success(res) {
        console.log(res);
        let data = res.data.data;
        that.setData({data:data});
        let arr = [];
        for(let i = 0 ; i<data.length;i++){
          arr.push({
            time:data[i].BUILDTIME,
            videoPath: data[i].SHORTVIDEOPATH,
            playNumber:data[i].PLAYNUMBERS,
            shareNumbers: data[i].SHARENUMBERS,
            videoId: data[i].SHORTVIDEOID,
            imgsrc: app.globalData.localhost + "/tlgklw/tl_core/servlet/videoImgServlet?videoId=" + data[i].SHORTVIDEOID,
            iconSrc: [
              "../../imgs/like.png",
              "../../imgs/share.png",
              "../../imgs/player.png"
            ],
          })
        }
        let arr2 = arr.reverse();
        that.setData({
          list:arr2
        })
        //设置初始大视频信息
        that.setData({ nowVideoSrc: data[0].SHORTVIDEOPATH})
        that.setData({ nowplayNumber: data[0].PLAYNUMBERS})
        that.setData({ nowshareNumber: data[0].SHARENUMBERS })
        that.setData({ likeNumber: data[0].THUMBERNUMBER })
        that.setData({ shortvideoId: data[0].SHORTVIDEOID })
        if (data[0].ISFLAG == 'true') {
          that.setData({
            iconSrc: [
              "../../imgs/liked.png",
              "../../imgs/share.png",
              "../../imgs/player.png"
            ],
          })
        } else if (data[0].ISFLAG == 'false') {
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
  onShow: function () {
    this.setData({
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth,
      buttonTop: app.globalData.finalTop,
      buttonLeft: app.globalData.finalLeft,
    })
  },
  //切换某一天视频
  chooseDay:function(e){
    let that = this;
   // console.log(e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index;
    wx.request({
      url: app.globalData.localhost + '/tlgklw/tl_interface/service/dataservice/siteVideoThreeDayData?siteId=' + that.data.sideId + '&useId=' + app.globalData.openId,
      success(res){
        let data = res.data.data;
        that.setData({ nowVideoSrc: data[index].SHORTVIDEOPATH })
        console.log(that.data.nowVideoSrc)
        that.setData({ nowplayNumber: data[index].PLAYNUMBERS })
        that.setData({ nowshareNumber: data[index].SHARENUMBERS })
        that.setData({ likeNumber: data[index].THUMBERNUMBER })
        //console.log(res.data.requestData)
        that.setData({ shortvideoId: data[index].SHORTVIDEOID })
        if (data[index].ISFLAG == 'true'){
          that.setData({
            iconSrc: [
              "../../imgs/liked.png",
              "../../imgs/share.png",
              "../../imgs/player.png"
            ],
          })
        } else if (data[index].ISFLAG == 'false'){
          that.setData({
            iconSrc: [
              "../../imgs/like.png",
              "../../imgs/share.png",
              "../../imgs/player.png"
            ],
          })
        }
      }
    });
   
    
  },
  //分享近三天视频页面
  onShareAppMessage:function(){
 
    return {
      title: '高空瞭望小程序',
      path: 'pages/threeDays/threeDays?sideId=' + this.data.sideId,
      
      success (res) {
        // 转发成功
        
        console.log("转发成功:" + JSON.stringify(res));
     
      },
      fail (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      },
      
    }
  },
  share:function(){
    let that = this;
    console.log(that.data.shortvideoId);
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
        //console.log(res)
        that.setData({ nowshareNumber: that.data.nowshareNumber + 1 })
      }
    });
  },
  //点赞获取用户unionID
  dianZan:function(){
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
       console.log(res.data.data);
       that.setData({ likeNumber: res.data.data.NUMBER })
       if (res.data.data.ISFLAG == 'true') {
         that.setData({
           iconSrc: [
             "../../imgs/liked.png",
             "../../imgs/share.png",
             "../../imgs/player.png"
           ],
         })
       } else if (res.data.data.ISFLAG == 'flase') {
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
  videoBegin:function(){
    let that = this;
    wx.request({
      url: app.globalData.localhost +'/tlgklw/tl_interface/service/dataservice/playVideo',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data:{
        shortVideoId: that.data.shortvideoId
      },
      success(res) {
        //console.log(res);
        that.setData({ nowplayNumber: that.data.nowplayNumber + 1})
        
      }
    })
  },
  switchChange:function(){
    wx.reLaunch({
      url: '../index/index',
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