//index.js
//获取应用实例
//设置启动点
var startPoint;
//设置启动点
const app = getApp();

Page({
  data: {
    buttonTop: app.globalData.finalTop,
    buttonLeft: app.globalData.finalLeft,
    windowHeight: '',
    windowWidth: '',
    switchURL:'../../imgs/jingcai.png',
    list: [],
    videoBegin: '../../imgs/videoBegin.png'
  },
  onReady: function () {
    this.switch = this.selectComponent("#switch");
     let that = this;
    wx.request({
      url:  app.globalData.localhost+'/tlgklw/tl_interface/service/dataservice/siteList',
      success(res){
        let dataArr = [];
        
       
        let data = res.data.data;
        for (let i = 0; i < data.length ; i++){
          dataArr.push({ 
            src: app.globalData.localhost+'/tlgklw/tl_core/servlet/cameraPreviewImgServlet?siteId='+ data[i].SITEID,
            iconSrc: [
              "../../imgs/location.png",
              "../../imgs/share.png",
             "../../imgs/views.png"
            ],
            text: data[i].SITENAME ,
            times: data[i].SHARENUMBER == null ? 0 : data[i].SHARENUMBER,
            sideId: data[i].SITEID,
            sideId2: data[i].RELATION_AQ_SITE,
            textDecoration: data[i].SITEREMARK,
            onlineNumber: data[i].ONLINENUMBER
          })
        }
        that.setData({ list: dataArr})
      }
    })

  
  


  },
  onLoad: function () {

  },
  onShow:function(){
    this.setData({
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth,
      buttonTop: app.globalData.finalTop,
      buttonLeft: app.globalData.finalLeft,
    })
  },
  //事件处理函数
  bindViewTap: function(event) {
  console.log(event)
  },
  goToZhibo:function(e){
    console.log(e);
  },

  toZhiBoVideo:function(e){
  console.log(e);
  console.log(this.data.list)
    wx.navigateTo({
      url: '../stationMonitor/stationMonitor?sideId=' + this.data.list[e.currentTarget.dataset.index].sideId + '&sideId2=' + this.data.list[e.currentTarget.dataset.index].sideId2 + '&sideName='+ this.data.list[e.currentTarget.dataset.index].text,
    })
  },
  switchChange:function(){ //switch的路由切换
     this.switch.routerToJingcai();
  },
  onShareAppMessage:function(){
    return {
      title: '桐庐高空瞭望',
      path: 'pages/index/index',
    
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
        // 转发成功
      },

      fail: function(res) {
        console.log(res + '失败');
        // 转发失败
      },
    complete: function(res) {
      // 不管成功失败都会执行
    }

  }
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
    if(Math.ceil(this.data.windowWidth / 2) > e.target.offsetLeft && e.target.offsetTop > 90 && e.target.offsetTop < this.data.windowHeight-130 ){
      //左边吸边
  
      this.setData({
        buttonTop: e.target.offsetTop,
        buttonLeft: 0
      })

    }else if(Math.ceil(this.data.windowWidth / 2) < e.target.offsetLeft && e.target.offsetTop > 90 && e.target.offsetTop < this.data.windowHeight - 130 ){
     //右边吸边
      this.setData({
        buttonTop: e.target.offsetTop,
        buttonLeft: this.data.windowWidth - 70
      })
      
    } else if (e.target.offsetTop < 90 ){
      //顶部吸边
      this.setData({
        buttonTop: 0,
        buttonLeft: e.target.offsetLeft
      })
    }else{
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
