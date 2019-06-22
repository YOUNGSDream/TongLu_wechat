import * as echarts from '../../ec-canvas/echarts.js';

let airLevelArr = [ '','优', '良', '轻度', '中度', '重度', '严重'];
let airLevelColorArr = ['', '#47E27D', '#FDE701', '#F29901', '#DE6A58', '#7B67D0', '#9B4E7B'];

let id1 = null;
let id2 = null;
const app = getApp();
let playerContext ;


//设置启动点
var startPoint;
//设置启动点



Page({
  data: {
    buttonTop: app.globalData.finalTop,
    buttonLeft: app.globalData.finalLeft,
    windowHeight: '',
    windowWidth: '',
    switchURL: '../../imgs/jingcai.png',
    iconSrc: [
      "../../imgs/like.png",
      "../../imgs/share.png",
      "../../imgs/views.png",
    ],
    thisPageVideoUrl: '',
    shareNumber: null,
    option: null,
    locationSrc:'../../imgs/location.png',
    ec:{
     
    },
    airPie:{
      lazyLoad:true,
    },
    airLine: {
      lazyLoad: true,
    },
    airLine2: {
      lazyLoad: true,
    },
    airLevelArr: [
      {
        text: '严重'
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
    ],
    isFull: false,
    lastTapTime: 0
  }, 
  onLoad:function(option){
    //console.log(option);  
    let that = this;
    //请求视频流数据
    
    that.setData({ option: null });
    that.setData({ option: option });
    that.setData({ location: option.sideName});
    wx.request({
      url: app.globalData.localhost+'/tlgklw/tl_interface/service/dataservice/siteInfo?siteId=' + option.sideId,
      success(res){
        console.log(res);
        that.setData({ thisPageVideoUrl: res.data.data.SHORTVIDEOADDRESS, shareNumber: res.data.data.SHARENUMBER});
        that.setData({ onlineNumber: res.data.data.ONLINENUMBER});
        //console.log(that.data.option)
      }
    });
  },
  onReady:function(){
    let that = this;
    //请求echarts数据
    this.pieComponent = this.selectComponent('#airPie1');
    this.lineComponent = this.selectComponent('#airLine1');
    this.lineComponent2 = this.selectComponent('#airLine2');
    wx.request({
      url:app.globalData.localhost + '/tlgklw/tl_interface/service/dataservice/airRealHourData?siteId=' + that.data.option.sideId2,
      success(res) {
        //aqi数据
        //console.log(res);
        let pieData = res.data.data.AQI;
        that.setData({ pieText: airLevelArr[pieData.AQIALEVER]})
        that.setData({ pieValue: pieData.AQI })
        that.setData({ pieColor: airLevelColorArr[pieData.AQIALEVER] })
        //line1数据
        let lineData = res.data.data.PM25;
        console.log(lineData)
        let pmData = [];
        let pmXdata = [];
        for (let i = 0; i < lineData.length; i++) {
          pmData.push(lineData[i].Value);
          pmXdata.push(lineData[i].COLLECTTIME);
        }
        that.setData({ lastTime: lineData[lineData.length - 1].COLLECTTIMES });
        that.setData({ line1data: pmData});
        that.setData({ line1Xdata: pmXdata });
        //line2数据
        let line2Data = res.data.data.O3;
        let o3xData = [];
        let o3Data = [];
        for (let i = 0; i < line2Data.length; i++) {
          o3Data.push(line2Data[i].Value)
          o3xData.push(line2Data[i].COLLECTTIME)
        }
        that.setData({ line2data: o3Data });
        that.setData({ line2Xdata: o3xData });
        //加载echarts
        that.initPieChartOption();
        that.initLineChartOption();
        that.initLineChartOption2();
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
  //饼图
  initPieChartOption:function(){
    this.pieComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      var text = this.data.pieText;
      var value = this.data.pieValue;
      var color = this.data.pieColor;
     
      var option = {
        title: {
          text: text,
          subtext: 'AQI',
          padding: [0, 0, 0, 0],
          subtextStyle: {
            fontSize: 20,
            color: 'black',
            fontWeight: 'bold',
          },
          grid: {
            right: '6%'
          },
          x: 'center',
          y: '58%',
          textStyle: {
            fontSize: 15,
            color: 'gray',
            fontWeight: 'normal'
          }
        },
        legend: {
          show: false,
          orient: 'vertical',
          x: 'left',
          data: ['多', '__other']
        },
        series: [
          {
            type: 'pie',
            radius: ['60%', '70%'],
            startAngle: 225,
            avoidLabelOverlap: false,
            itemStyle: {
              normal: { color: 'rgba(0,0,0,0.05)' }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{ value: 270 },
            { value: 90, name: '__other', itemStyle: { normal: { color: 'rgba(0,0,0,0)' } } }],

            animation: true
          },
          {
            name: '访问来源',
            type: 'pie',
            radius: ['60%', '70%'],
            startAngle: 225,
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                formatter: '{c}',
                padding: [0, 0, 15, 0],
                fontSize: 32,
                fontWeight: 'bold',
              },

            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: value,
                itemStyle: {
                  color: color
                }
              },

              { value: 90, name: '__other', itemStyle: { normal: { color: 'rgba(0,0,0,0)' } } }
            ]
          }
        ]
      }
      chart.setOption(option);
      return chart;
    })
  },

  //折线图1


  initLineChartOption:function(){
    this.lineComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      var text = 'PM2.5 (μg/m³)';
      var xData = this.data.line1Xdata;
      var data = this.data.line1data;
    
      var option = {
        title: [{
          text: text,
          textStyle: {
            fontSize: 14
          }
        }],
        tooltip: {
          trigger: 'axis',
          position: function (point, params, dom, rect, size) {
            // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
            // 提示框位置
            var x = 0; // x坐标位置
            var y = 0; // y坐标位置

            // 当前鼠标位置
            var pointX = point[0];
            var pointY = point[1];

            // 外层div大小
            // var viewWidth = size.viewSize[0];
            // var viewHeight = size.viewSize[1];

            // 提示框大小
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];

            // boxWidth > pointX 说明鼠标左边放不下提示框
            if (boxWidth > pointX) {
              x = 5;
            } else { // 左边放的下
              x = pointX - boxWidth;
            }

            // boxHeight > pointY 说明鼠标上边放不下提示框
            if (boxHeight > pointY) {
              y = 5;
            } else { // 上边放得下
              y = pointY - boxHeight;
            }

            return [x, y];
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        grid: {
          top: "25%",
          left: '8%',
          right: '6%',
          bottom: '25%',
        },
        series: [

          {
            name: 'PM2.5',
            type: 'line',
            data: data,
            itemStyle: {
              color: "red"
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },

              ]
            },

          }
        ]
      };
      chart.setOption(option);
      return chart;
    })
  },

  //折线图2
  initLineChartOption2: function () {
    this.lineComponent2.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      var text = 'O₃ (μg/m³)';
      var color = 'green';
      var xData = this.data.line2Xdata;
      var data = this.data.line2data;
      //console.log(xData);
      var option = {
        title: [{
          text: text,
          textStyle: {
            fontSize: 14
          }
        }],
        tooltip: {
          trigger: 'axis',
          position: function (point, params, dom, rect, size) {
            // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
            // 提示框位置
            var x = 0; // x坐标位置
            var y = 0; // y坐标位置
            var pointX = point[0];
            var pointY = point[1];
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];
            if (boxWidth > pointX) {
              x = 5;
            } else { // 左边放的下
              x = pointX - boxWidth;
            }
            if (boxHeight > pointY) {
              y = 5;
            } else { // 上边放得下
              y = pointY - boxHeight;
            }
            return [x, y];
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          }

        },
        grid: {
          top: "25%",
          left: '8%',
          right: '6%',
          bottom: '25%',
        },
        series: [

          {
            name: 'O₃',
            type: 'line',
            data: data,
            itemStyle: {
              color: color
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },

              ]
            },

          }
        ]
      };
      chart.setOption(option);
      return chart;
    })
  },
  //改变全屏播放
  switchChange:function(){
    wx.reLaunch({
      url: '../wonderful/wonderful',
    })
  },
 onShareAppMessage:function(ops){
   return {
     title: '高空瞭望小程序',
     path: 'pages/stationMonitor/stationMonitor?sideId=' + this.data.option.sideId + '&sideId2=' + this.data.option.sideId2,
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
  //livePlayer全屏功能实现
  statechange(e) {
    console.log(e);
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  requestFullScreen: function () {
    var playerContext = wx.createLivePlayerContext("liver-player1");
    playerContext.requestFullScreen({ 'direction': 90 });
  },
  exitFullScreen: function () {
    
    var playerContext = wx.createLivePlayerContext("liver-player1");
    playerContext.exitFullScreen();
    console.log(1);
  },

  /**
   * 生命周期函数--监听页面加载
   */

  fullscreenchange: function (e) {
   
    console.log(e.detail.fullScreen);
    this.setData({ isFull: e.detail.fullScreen})
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
    // console.log(e);
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