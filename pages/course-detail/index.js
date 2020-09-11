// pages/course-detail/index.js

var WxParse = require('../../components/wxParse/wxParse.js')

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
        attributeCls:'',
        classId:'',
        detaildata:{

        },
        imgUrl: app.globalData.imgUrl,


        isScroll: false,
        showDialogCourse:false,
        showDialogLecturer:false,
        showDialog:false,
        showDialogStudy:false,
        typePxd:false,
        srcUrl: '',
        newsList:[          
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        var attributeCls=options.attributeCls;  
        var attribute=options.attribute;  
        var id=options.id;        
        var _obj=options.typePxd;        
        this.setData({
            attributeCls: attributeCls,
            attribute: attribute,
            typePxd: _obj,
            classId: id
        });
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
    hideModalBB(e) {
        this.setData({
            showDialog: false
        })
        this.showModalStudy();
    },

    showModalStudy() {
        this.setData({
            showDialogStudy: true
        })
    },
    hideModalStudy(e) {
        this.setData({
            showDialogStudy: false
        })
        //跳转至学习首页
        wx.reLaunch({
            url: '/pages/index/index?PageCur=learn',
        });
    },

    addBB(){
        //this.showModal();
        let detaildata= this.data.detaildata;
        if(detaildata ==null || detaildata.classId==null|| detaildata.classId==''){
          return;
        }
        if(detaildata.isOver==1){
            wx.showToast({
              title: '课程已过期',
               icon: 'none',
              duration: 3500
            })
            return;
        }

        let classId=detaildata.classId;
        let className=detaildata.className;
        wx.redirectTo({
            url: "/pages/select-school/index?id=" + classId+"&className="+className
        })
    },

    
    showModalLecturer() {
        this.setData({
            showDialogLecturer: true
        })
    },
    hideModalLecturer(e) {
        this.setData({
            showDialogLecturer: false
        })
    },

    showModalCourse() {
        this.setData({
            showDialogCourse: true,
            isScroll: false
        })

        let newsUrl= this.data.detaildata.summary;
        WxParse.wxParse('newsDetailData', 'html', newsUrl, this,5)
        

    },
    hideModalCourse(e) {
        this.setData({
            showDialogCourse: false,
            isScroll: true
        })
    },
    
    //课程详情（未报名）
    getData(){
        let that=this;
        let accountId= wx.getStorageSync('accountId');
        const  data = {
          classId: that.data.classId,
        //   accountId: accountId
        };
        wx.showLoading({
            title: '努力加载中',
            mask: true
          });
        train_request.Get('/rest/class/get-class-detail.gson', data, function (res) {
          console.log(res);
          wx.hideLoading();
          if(res.attribute.data!=null){
             that.setData({
              detaildata: res.attribute.data
             })
            
             that.geclassfirstvideo();
          }
         
        }, function (err) {
          console.log(err);
          wx.hideLoading();
        });
      },

      //获取课程的第一个视频（未报名）
      geclassfirstvideo(){
        let that=this;
        const  data = {
          classId: that.data.classId,
        };
        train_request.Get('/rest/class/get-class-first-video.gson', data, function (res) {
          console.log(res);
          if(res.attribute.data!=null){
             that.setData({
                firstvideo: res.attribute.data  //a18dce4e43671dc48d6d1f9bc1e3cf8d_a
             })
             console.log("firstvideo:"+that.data.firstvideo);
             that.setPlay();
         
          }
         
        }, function (err) {
          console.log(err);
        });
       
      },






      setPlay(){
       //获取视频播放地址
       let that=this;
       let vid = that.data.firstvideo;
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
    //    if(that.data.typePxd){
       
    //    }else{
    //     this.player = polyv.getVideo(vidObj);
    //    }
       this.player = polyv.getPreviewVideo(vidObj);
      },

      //获取视频播放地址
      getvideo(){
        let that=this;
        let detaildata=this.data.detaildata;
        let accountId= wx.getStorageSync('studyAccountId');
        let dbNumber = wx.getStorageSync('dbNumber');
        let pid= detaildata.courseList[0].videoList[0].videoEntity.projectId;
        let vid= this.data.firstvideo;
        let playduration=0;
        let ts= Date.parse(new Date()); //13位时间戳
        const  watchInfo = {
            type: detaildata.courseList[0].videoList[0].videoEntity.type!=0?'1':'',
            sign: sha1.sha1(pid + vid + playduration + ts +md5.hexMD5(vid).substring(0, 8)),
            vid: vid,
            pid: pid,
            playduration: playduration,
            timestamp: ts,
        };

        let str=JSON.stringify(watchInfo);
        var dataBase = detaildata.myClassId + "%&!" +detaildata.myClassCourseId + "%&!" 
             + detaildata.courseList[0].videoList[0].courseVideoId+ "%&!" + str
              + "%&!" + dbNumber + "%&!" + accountId;
           
        let dataAes= aes_util.AesEncrypt(dataBase);
        const  data = {
            data: dataAes
        };
          train_request.Post('/rest/cms/my-video/sv2.gson', data, function (res) {
            console.log(res);
            // if(res.attribute.data!=null){
              
            // }
           
          }, function (err) {
            console.log(err);
          });
      },
})