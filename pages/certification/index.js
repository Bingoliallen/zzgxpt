// pages/certification/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      src: null,
      sfzurl:null,
      select_read:false,
      isRegister:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var _obj=options.isRegister;        
      this.setData({
        isRegister: _obj 
      });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    toUp: function(e) {
        let that =this;
        wx.navigateTo({
          url: "/pages/certification/idcard-collection/index?isRegister="+ that.data.isRegister 
        })
    },

    numSteps: function(e) {
      let that =this;
      if(this.data.sfzurl==null ||this.data.sfzurl=='' ){
        wx.showToast({
          title: '请先上传身份证正面照',
           icon: 'none',
          duration: 3500
        })
        return;
      }
      if(this.data.select_read==false){
        wx.showToast({
          title: '请先阅读并同意协议',
           icon: 'none',
          duration: 3500
        })
        return;
      }
      wx.redirectTo({
        url: "/pages/certification/face-recognition/index?sfzurl="+that.data.sfzurl +"&isRegister="+that.data.isRegister 
        
      })
        
    },
    
    selectRead: function (e) {
      var that = this;
      that.setData({
        select_read: (!that.data.select_read)
      })
    },

    goYhxy(){
      wx.navigateTo({
          url: '/pages/webview/index?title='+'用户协议'+'&newsUrl='+'https://wx-image.ghlearning.com/html/User_agreement.html',
        });
  },

  goYstk(){
      wx.navigateTo({
          url: '/pages/webview/index?title=隐私政策&&newsUrl=https://wx-image.ghlearning.com/html/Privacy_policy.html',
        });
  },
  goRlcj(){
      wx.navigateTo({
          url: '/pages/webview/index?title=人脸采集与识别服务协议&&newsUrl=https://wx-image.ghlearning.com/html/Face_protocol.htm',
        });
  },






})