Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties:{
    src:{
      type:String,
      value:''
    }
  },
  data:{
    nowInZhiBo:true
  },
  methods:{
    routerToJingcai:function(){
      // this.setData({
      //   nowInZhiBo:!this.data.nowInZhiBo
      // })
        wx.redirectTo({
          url: '../wonderful/wonderful',
        })
    },
    routerToZhiBo: function () {
      // this.setData({
      //   nowInZhiBo: !this.data.nowInZhiBo
      // })
        wx.redirectTo({
          url: '../index/index',
        })
      }

    }

  
})

// components/switch/switch.js
