// pages/news-detail/index.js
//const request = require('../../utils/request.js')
const util = require('../../utils/util.js')
var WxParse = require('../../components/wxParse/wxParse.js')


Page({

    /**
     * 页面的初始数据
     */
    data: {
        newsTitle: '',
        newsUrl: '',
        newsAuthor: '',
        contentTip: '新闻详情为url链接...'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let newsUrl= options.newsUrl;
        var title=options.title;        
        this.setData({
            newsUrl: newsUrl, 
            newsTitle: title,
        });


        // request({
        //   url: newsUrl
        // }).then(res => {
        //   WxParse.wxParse('newsDetailData', 'html', util.getBodyHtml(res), this)
        // })
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

    }
})