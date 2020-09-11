// pages/mine/setting/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        showDialog:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    showModal() {
        this.setData({
          showDialog: true
        })  
    },
    hideModal(e) {
        this.setData({
          showDialog: false
        })   
    },
    hideModalTC(e) {
        this.setData({
          showDialog: false
        })   
        this.toclearStorage();
    },  
    toclearStorage(){
        
        wx.clearStorage();
        wx.setStorageSync('mobileRegister', null);
        wx.setStorageSync('pwdRegister', null);
        wx.showToast({
          title: '已退出当前账号',
           icon: 'none',
          duration: 3500
        })
        wx.redirectTo({
            url: '/pages/index/index?PageCur=learn',
          });
    },
    goGrzl(){
        wx.navigateTo({
            url: '/pages/mine/user-info/index',
          });
    },
    goGywm(){
        wx.navigateTo({
            url: '/pages/mine/about-us/index',
          });
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