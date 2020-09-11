// pages/nav-detail/index.js
var time = require('../../utils/time.js');
const dev_request = require('../../utils/dev_request.js')
const train_request = require('../../utils/train_request.js')
const app = getApp();
import polyv from '../../utils/polyv.js';

const aes_util = require('../../utils/aes_util.js')
const md5 = require('../../utils/md5.js')
const sha1 = require('../../utils/sha1.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        CustomBar: app.globalData.CustomBar,
        typeId:'',//判断是精品还是非遗
        elaborateId:'',
        releaseTime:'',
        detaildata:{
        },
        imgUrl: app.globalData.imgUrl,
        url:'',
        srcUrl: '',
        isopen: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var elaborateId=options.id;     
        var typeId=options.typeId;           
        this.setData({
            typeId: typeId,
            elaborateId: elaborateId 
        });
        this.setData({
          videoCtx:wx.createVideoContext('myVideo', this)
        })
        this.getData();
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
      this.data.videoCtx.pause();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      this.player.destroy();
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

    timeupdate: function(e) {
       this.player.timeUpdate(e);
   },

    getData(){
        let that=this;
        let accountId= wx.getStorageSync('accountId');
        const  data = {
          type: that.data.typeId,
          elaborateId: that.data.elaborateId,
          accountId: accountId
        };
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });
        train_request.Get('/rest/elaborate/elaborate-info.gson', data, function (res) {
          console.log(res);
          wx.hideLoading();
          if(res.attribute.data!=null){
             that.setData({
              detaildata: res.attribute.data
             })
             if(res.attribute.data.elaborateCourseVideoListSort!=null && res.attribute.data.elaborateCourseVideoListSort.length){
                 if(res.attribute.data.elaborateCourseVideoListSort[0].videoEntity!=null){
                     that.setData({
                        videoSource: res.attribute.data.elaborateCourseVideoListSort[0].videoEntity.videoSource
                      })
                 }
                 
             }
             var sjc = res.attribute.data.releaseTime;
             let releaseTime= time.formatTimeTwo(sjc,'Y-M-D');
             that.setData({
              releaseTime: releaseTime
             })
             that.setPlay();
          }
         
        }, function (err) {
          console.log(err);
          wx.hideLoading();
        });
      },

      setPlay(){
        //获取视频播放地址
        let that=this;
        let vid = that.data.videoSource;
        var timestamp = Date.parse(new Date());
        console.log("当前时间戳为：" + timestamp); 
        var secretKey ="9oeyfSRsxo";
        var ts=timestamp;
        var sign =md5.hexMD5(secretKey+vid+ts);
        let vidObj = {
           vid: vid,
           ts,
           sign,
          callback: function(videoInfo){
              that.setData({
                  srcUrl: videoInfo.src[0]
              });
              console.log("srcUrl:"+that.data.srcUrl);
          }
        };
        this.player = polyv.getVideo(vidObj);
       },

    toclose(){
        let that=this;
        that.setData({
          isopen: false
        });
    },

})