// pages/mine/about-us/index.js
const dev_request = require('../../../utils/dev_request.js')
const train_request = require('../../../utils/train_request.js')
const app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {

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

    //检查更新
    getnewversion(){
        let that=this;
        const  data = {
            type: 1
        };
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });
        train_request.Get('/rest/common/version/get-new-version.gson', data, function (res) {
          console.log(res);
          wx.hideLoading();
         
        }, function (err) {
          wx.hideLoading();
          console.log(err);
        });
      },
})