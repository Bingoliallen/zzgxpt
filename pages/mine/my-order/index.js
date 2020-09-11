// pages/mine/my-order/index.js
const dev_request = require('../../../utils/dev_request.js')
const train_request = require('../../../utils/train_request.js')
const app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        CustomBar: app.globalData.CustomBar,
        imgUrl: app.globalData.imgUrl,
        totalPage: 0,
        pageNo: 1,
        PageSize: 10,
        orderStatus: -1,
        list: [],

        TabCur: 0,
        scrollLeft:0,
        scrollList: [{
            id: -1,
            name: '全部',
          }, {
            id: 0,
            name: '待付款',
          }, {
            id: 1,
            name: '已付款',
          }, {
            id: 2,
            name: '已取消',
          }],
          newsList:[],
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
      this.setData({
        pageNo: 1,
        totalPage: 0,
      })
      this.getOrder(1);
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
      wx.showNavigationBarLoading(); //在标题栏中显示加载图标
      this.setData({
        pageNo: 1,
        totalPage: 0,
      })
      this.getOrder(1);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if(this.data.totalPage<=this.data.pageNo){
        wx.showToast({
          title: '没有更多了',
           icon: 'none',
          duration: 1000
        })
         return;
      }
      let pageNo=this.data.pageNo+1;
      this.setData({
        pageNo: pageNo
      })
      this.getOrder(this.data.pageNo);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    tabSelect(e) {
        this.setData({
          orderStatus: e.currentTarget.dataset.item.id,
          TabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id-1)*60
        })
        this.setData({
          pageNo: 1,
          totalPage: 0,
        })
        this.getOrder(1);
    },
    getOrder(topageNo){
      let that=this;
      let accountId= wx.getStorageSync('studyAccountId');
      const  data = {
        pageNo: topageNo,
        PageSize: that.data.PageSize,
        accountId: accountId,
        orderStatus: that.data.orderStatus
      };
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      train_request.Get('/rest/cms/order/find-my-order.gson', data, function (res) {
        console.log(res);
        wx.hideLoading();
        if(res.attribute.data.list!=null){
          
          that.setData({
            totalPage: res.attribute.data.totalPage
          })
          if(topageNo==1){
            that.setData({
              list: res.attribute.data.list
             })
          }else{
            that.setData({
              list: that.data.list.concat(res.attribute.list)
          })
          }
           
        }
        wx.hideNavigationBarLoading(); //完成停止加载图标
        wx.stopPullDownRefresh();
       
      }, function (err) {
        console.log(err);
        wx.hideLoading();
        wx.hideNavigationBarLoading(); //完成停止加载图标
        wx.stopPullDownRefresh();
      });
    },
    goDetail: function(e) {
      wx.navigateTo({
        url: "/pages/mine/my-order/order-detail/index?id=" + e.currentTarget.dataset.id
      })
    },
})