// pages/webview/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        newsUrl: '',
        title:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const newsUrl = options.newsUrl;
        this.setData({
            newsUrl:newsUrl,
        })
        
        if (typeof(options.title) == "undefined"){ 
            
        }else{
            const title = options.title;
            this.setData({
                title:title,
            })
        }
        
        
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
        if (typeof(this.data.title) == "undefined"){ 

        }else{
            wx.setNavigationBarTitle({
                title: this.data.title
            })
        }
        
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