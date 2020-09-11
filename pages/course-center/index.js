// pages/course-center/index.js
const dev_request = require('../../utils/dev_request.js')
const train_request = require('../../utils/train_request.js')
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLogin:false,
        typeId: 0,
        list:[],
        iconList: [{
            id: '0',
            color: 'red',
          }, {
            id: '0',
            color: 'orange',
          }, {
            id: '0',
            color: 'yellow',
          }, {
            id: '0',
            color: 'olive',
          }, {
            id: '0',
            color: 'cyan',
          }, {
            id: '0',
            color: 'blue',
          }, {
            id: '0',
            color: 'purple',
          }, {
            id: '0',
            color: 'mauve',
          }, {
            id: '0',
            color: 'purple',
          }, {
            id: '0',
            color: 'mauve',
          }],
          gridCol:3,
          gridBorder:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var _obj=options.typeId;        
      console.log(_obj);
      this.setData({
          typeId: _obj 
      });
      let that=this;
      let accountId= wx.getStorageSync('accountId');
      if(accountId== null || accountId==''){
        that.setData({
          isLogin: false 
        })
      }else {
        that.setData({
          isLogin: true 
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
         this.getData();
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
      this.getData();
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

    toCourseList: function(e) {
      if(this.data.isLogin==false){
        wx.navigateTo({
          url: "/packages/pages/login/index?type=learn"
        })
        return;
      }
      let typeId=this.data.typeId;
      let navName= e.currentTarget.dataset.item.name;
      wx.navigateTo({
        url: "/pages/course-list/index?id=" + e.currentTarget.dataset.id
             +"&title="+navName+"&typeId="+typeId
      })
    },

    getData(){
      let that=this;
      const  data = {
        type: that.data.typeId
      };
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      dev_request.Post('/v1/app/query-all-major.gson', data, function (res) {
        console.log(res);
        wx.hideLoading();
        if(res.attribute.data!=null){
           that.setData({
            list: res.attribute.data
           })
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

})