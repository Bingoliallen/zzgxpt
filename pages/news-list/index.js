// pages/news-list/index.js
const app = getApp();
const dev_request = require('../../utils/dev_request.js')
const train_request = require('../../utils/train_request.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        TabCur:0,
        title:'',
        typeId:'',
        wzlist:[],
        urls:[
            '/images/notice@3x.png',
            '/images/operatin_performance@3x.png',
            '/images/law@3x.png',
            
        ],
        
        newsList:[],
     
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _obj=options.title;   
        var _typeId=options.typeId; 
        var _tab=options.TabCur; 
        

        console.log(_obj);
        this.setData({
            title: _obj,
            typeId: _typeId, 
            TabCur: _tab, 
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

    goDetail: function(e) {
       let str = e.currentTarget.dataset.id;
       //let str1 = str.replace('https://zjjnts.ghlearning.com:80', 'https://zjjnts.ghlearning.com');
        wx.navigateTo({
          url: '/pages/webview/index?newsUrl=' + str
        })
    },

    getData(){
          let that=this;
          if(that.data.TabCur==0){
                  //通知公告
                  let tzurl='http://zjjnts.ghlearning.com/app.jspx?template=abc&nodeId=4514';
                  const tzdata = {
                    type: 1,
                    'url':tzurl
                  };
                  train_request.Post('/rest/springboard/get-data.gson', tzdata, function (res) {
                    console.log(res);
                    if(res.attribute!=null){
                       that.setData({
                        wzlist: res.attribute[tzurl]
                       })
                    }
                    wx.hideNavigationBarLoading(); //完成停止加载图标
                    wx.stopPullDownRefresh();
                  }, function (err) {
                    console.log(err);
                    wx.hideNavigationBarLoading(); //完成停止加载图标
                    wx.stopPullDownRefresh();
                  });
          }else if(that.data.TabCur==1){
                 //工作动态
                 let gzurl='http://zjjnts.ghlearning.com/app.jspx?template=abc&nodeId=4513';
                 const gzdata = {
                  type: 1,
                   'url':gzurl
                 };
                 train_request.Post('/rest/springboard/get-data.gson', gzdata, function (res) {
                   console.log(res);
                   if(res.attribute!=null){
                      that.setData({
                        wzlist: res.attribute[gzurl]
                      })
                   }
                   wx.hideNavigationBarLoading(); //完成停止加载图标
                    wx.stopPullDownRefresh();
                 }, function (err) {
                   console.log(err);
                   wx.hideNavigationBarLoading(); //完成停止加载图标
                    wx.stopPullDownRefresh();
                 });
          }else if(that.data.TabCur==2){
                //法律法规列表
                let url='http://zjjnts.ghlearning.com/app.jspx?template=abc&nodeId=4515';
                const flfgdata = {
                  type: 1,
                  'url':url
                };
                train_request.Post('/rest/springboard/get-data.gson', flfgdata, function (res) {
                  console.log(res);
                  if(res.attribute!=null){
                     that.setData({
                      wzlist: res.attribute[url]
                     })
                  }
                  wx.hideNavigationBarLoading(); //完成停止加载图标
                  wx.stopPullDownRefresh();
                }, function (err) {
                  console.log(err);
                  wx.hideNavigationBarLoading(); //完成停止加载图标
                  wx.stopPullDownRefresh();
                });
          }
          
      
         
      
         
    },
})