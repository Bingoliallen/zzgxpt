// pages/open-study/start-study/index.js
const dev_request = require('../../../utils/dev_request.js')
const train_request = require('../../../utils/train_request.js')
const devtrain_request = require('../../../utils/devtrain_request.js')
const app = getApp();

import polyv from '../../../utils/polyv.js';

 const aes_util = require('../../../utils/aes_util.js')
//const Decrypt = require('../../../utils/aes_util.js').Decrypt;


const md5 = require('../../../utils/md5.js')
const sha1 = require('../../../utils/sha1.js')



Page({

    /**
     * 页面的初始数据
     */
    data: {
        isChechkSuccessNum: true,
        isRenLianCheckSuss: true,
        isClassLearnOver: false,

        changeVideo:false,
        video_real_time:0, //实时播放进度

        isNetworkStatusOk:false,
        isNetworkStatusError:false,
        fullScreen:false,
        fullScreen1:false,
        fullScreen2:false,

        checkSuccessNumber:0,
        animation: '',

        name:null,
        phone:null,
        planExamTime: null,
        gz: null,
        gzdj: null,
        bz: null,
        uncommittedList: null,
        uncommittedIndex: -1,
        showJYDialog:false,


        isWatchOver:false,
        autoplay:false,
        startplaytime:0,
        configBean: app.globalData.configBean,
        config: app.globalData.config,
        isAutoNextVideo:0,
        banSeek:"on",
       
        CustomBar: app.globalData.CustomBar,
        numPlay:0,
        num:10,
        setInter:'',//存储计时器
         
        unCheckvideoRateid:0,//为通过的抓拍的进度值位置
        isChechk:false,
        unCheckNum:0,//抓拍失败次数
        CheckNum:0,//抓拍成功次数
        videoLearnRate:0,//当前视频已学习的时长
        classLearnRate:0,//当前班级已学习的进度
        courseLearnRate:0,//当前课程已学习的进度
        showDialog:false,
        isPlaysv2:false,
        currentTime:0,
        playduration:0,
        indexid:0,
        videoindexid:0,
        myClassId:null,

        showDialogERROR:false,

        detaildata:{

        },
        myClassCourseRP:{

        },
        videoRPs:[

        ],
        faceCheckVideoRPS:[

        ],
       
        url:'',
        src: '',
        newsList:[
                      
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
          configBean: app.globalData.configBean,
        });
        this.setData({
          isAutoNextVideo: this.data.configBean.isAutoNextVideo,
          banSeek: this.data.configBean.banSeek,
        });


        var classId=options.classId;   
        var myClassId=options.myClassId;    
        var indexid=options.index;    
        this.setData({
            indexid: indexid,
            classId: classId,
            myClassId: myClassId
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
      let isRenLianCheckSuss =  wx.getStorageSync('isRenLianCheckSuss');
      if(isRenLianCheckSuss == null || isRenLianCheckSuss == ''){
       
      }else{
        if(isRenLianCheckSuss =='1'){
          this.setData({
            isRenLianCheckSuss: true,
          });
          this.getDataNumRef();
        }else  if(isRenLianCheckSuss =='0'){
          this.setData({
            isRenLianCheckSuss: false,
          });
        }
       
        wx.setStorageSync('isRenLianCheckSuss', null);
      }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      // this.data.videoCtx.pause();
      // this.endPlaySetInter();
      // this.endSetInter();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        wx.setStorageSync('isRenLianCheckSuss', null);
        this.player.destroy();
        this.endPlaySetInter();
        this.endSetInter();
        this.endJYSetInter();
        this.endRefSetInter();
        wx.offNetworkStatusChange();
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

    timeupdate: function (e) {
        if(this.data.changeVideo==true){
         return
        }
        console.log("timeupdate----currentTime--:"+e.detail.currentTime);
        //实时播放进度 秒数
        let currentTime = e.detail.currentTime;
        let that = this;
        if(currentTime==0 && that.data.startplaytime==that.data.video_real_time){

        }else{
          
          let aa = that.data.banSeek=='on'?false:true; // 是否开启可以视频快进
          let isWatchOver= that.data.isWatchOver;
          let isClassLearnOver= that.data.isClassLearnOver;
          
          var currentTime1 = parseInt(e.detail.currentTime)//查看正在播放时间，以秒为单位
          var jump_time = parseInt(that.data.video_real_time) //当前视频进度
          console.log("timeupdate----currentTime1--:"+currentTime1);
          console.log("timeupdate----jump_time--:"+jump_time);
          if(isClassLearnOver==false && isWatchOver==false){
            if(aa==false){
           
              if (currentTime1 > jump_time && currentTime1 - jump_time>2){
                that.data.videoCtx.seek(that.data.video_real_time)
                wx.showToast({
                  title: '该视频不允许快进',
                  icon: 'none',
                  duration: 3000,
                })
                return;
              }
            } 
          }
          
          that.setData({
            video_real_time: currentTime1, //实时播放进度
          })
        }

        this.setData({
            currentTime: currentTime
        })
        
        
        let floor=Math.floor(currentTime);//向下取整
        if(floor%10==0 &&this.data.playduration<floor){
            
        }

        if(this.data.isPlaysv2==true){
            //获取哪些时间段需要抓拍
            // faceCheckVideoRPS[videoindexid].checkSuccessNumber
            let videoindexid =this.data.videoindexid; 
            if(this.data.faceCheckVideoRPS ==null || this.data.faceCheckVideoRPS.length<=0){
              return;
            }
            let videoId= this.data.videoRPs[videoindexid].videoId;
            let unCheckFaceList=null;
            let checkSuccessNumber=0;
            for(let j=0;j<this.data.faceCheckVideoRPS.length;j++){
                if(this.data.faceCheckVideoRPS[j].videoId ==videoId){
                      console.log("--faceCheckVideoRPS----"+j+"个-----:",this.data.faceCheckVideoRPS[j]);
                      unCheckFaceList=this.data.faceCheckVideoRPS[j].unCheckFaceList;
                      checkSuccessNumber=this.data.faceCheckVideoRPS[j].checkSuccessNumber;
                      break;
                }
            }
          
            if(unCheckFaceList==null || unCheckFaceList.length<=0){
              return;
            }
            if(checkSuccessNumber==unCheckFaceList.length){
              return
            }
             for(let i=0;i<unCheckFaceList.length;i++){
              console.log("unCheckFaceList----"+i+"个--:"+unCheckFaceList[i].videoRate);
               if(i==this.data.unCheckvideoRateid){
                    let videoRate=unCheckFaceList[i].videoRate;
                    let faceCheckId=unCheckFaceList[i].faceCheckId;
                    if(this.data.videoLearnRate>=videoRate && this.data.isChechk==false){
                    
                      if(this.data.showDialog==false){
                          this.setData({
                            isChechk: true,
                            showDialog: true
                          })
                          this.startSetInter(faceCheckId);
                      }
                      
                  }
               }
               
             }
      
       

        }
        this.player.timeUpdate(e);
    },


    startKZSetInter: function(faceCheckId){
      var that = this;
      //将计时器赋值给setInter
      that.setData({ numKZ: 1 });  
      console.log("---startKZSetInter-0--:"+that.data.numKZ);
      if(that.data.numKZ==1){
        console.log("---startKZSetInter---:"+that.data.numKZ);
        if(that.data.unCheckNum<3){
         
          // if(that.data.showDialog==false){
            that.setData({
              isChechk: true,
              showDialog: true
            })
            that.startSetInter(faceCheckId);
          // }
       }else{
          that.data.videoCtx.exitFullScreen();
          that.data.videoCtx.pause();
          that.setData({
              faceCheckId: faceCheckId,
             // isChechk: false,
              showDialog: false,
              showDialogERROR: true,
              numKZ: -1
          })
       
       }
      }


    //   that.data.setKZInter = setInterval(
    //       function () {
             
              
              
             
    //           if(that.data.numKZ<0){
    //               that.endKZSetInter();
    //           }
    //       }
    // ,5000);   
  },
  endKZSetInter: function(){
      var that = this;
      //清除计时器  即清除setInter
     // clearInterval(that.data.setKZInter)
      that.setData({ numKZ: 0 });
      console.log("---endKZSetInter---:"+that.data.numKZ);
  },



    startSetInter: function(faceCheckId){
        var that = this;
        if(that.data.unCheckNum>=1){
          that.setData({ 
            isChechkSuccessNum: true,
            num: 3 });
        }else{
          that.setData({ 
            isChechkSuccessNum: true,
            num: 10 });
        }
       
        //将计时器赋值给setInter
        that.data.setInter = setInterval(
            function () {
                var numVal = that.data.num - 1;
                that.setData({ num: numVal });
                if(that.data.num==0){
                    that.takePhoto(faceCheckId);
                }else if(that.data.num<-2){
                  //that.endSetInter();
                }
                
                // else if(that.data.num<-2){
                //   that.setData({ 
                //     showDialog: false });
                // }else if(that.data.num<-5){
                //   that.endSetInter();
                // }
            }
      , 1000);   
    },

    endSetInter: function(){
        var that = this;
        //清除计时器  即清除setInter
        clearInterval(that.data.setInter)
        that.setData({ num: 10 });
        that.setData({ 
          // isChechk: false,
          showDialog: false });
    },

    endSetInterFail: function(){
      var that = this;
      //清除计时器  即清除setInter
      clearInterval(that.data.setInter)
   },

    startPlaySetInter: function(){
      var that = this;
      that.setData({ numPlay: 0 });
      //将计时器赋值给setInter
      that.data.setPlayInter = setInterval(
          function () {
            var numVal = that.data.numPlay + 1;
            console.log("startPlaySetInter---:"+numVal);
            that.setData({ numPlay: numVal });
             
              if(that.data.numPlay%10==0){
                that.setData({
                   playduration: Math.ceil(that.data.currentTime)
                 })
                 if(that.data.isPlaysv2==true){
                   let times=that.data.currentTime;
                   that.getvideocv2(times);
                
                 }
              }
              
              // if(that.data.numPlay<0){
              //     that.endPlaySetInter();
              // }
          }
    , 1000);   
  },

  endPlaySetInter: function(){
      var that = this;
      //清除计时器  即清除setInter
      clearInterval(that.data.setPlayInter)
      that.setData({ 
        isPlaysv2:false,
        numPlay: 0 });
      console.log("endPlaySetInter---:"+that.data.numPlay);
  },

  startRefSetInter: function(){
    var that = this;
    that.setData({ numRef: -1 });
    //将计时器赋值给setInter
    that.data.setRefInter = setInterval(
        function () {
            console.log("------startRefSetInter------");
            var numVal = that.data.numRef + 1;
            that.setData({ numRef: numVal });
            if(that.data.numRef%10==0){
              that.getDataRef();
            }
           
        }
  , 1000);   
},
endRefSetInter: function(){
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setRefInter)
    that.setData({ numRef: -1 });
    console.log("------endRefSetInter------");
},

  startJYSetInter: function(){
    var that = this;
    that.setData({ numJY: -1 });
    //将计时器赋值给setInter
    that.data.setJYInter = setInterval(
        function () {
            console.log("------startJYSetInter------");
            var numVal = that.data.numJY + 1;
            that.setData({ numJY: numVal });
            if(that.data.numPlay%10==0){
              if(that.data.showJYDialog==false){
                that.getDataToJY();
              }
            }
            
        }
  , 10000);   
},

endJYSetInter: function(){
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setJYInter)
    that.setData({ numJY: -1 });
    console.log("------endJYSetInter------");
},



    //获取我的课程信息（报名成功，点击进入详情之前，需调用并判断班级学习是否已过期）
   getData(){
    let that=this;
    let indexid=this.data.indexid;
    let accountId= wx.getStorageSync('studyAccountId');
    const  data = {
        myClassId: that.data.myClassId,
        accountId: accountId
    };
    train_request.Get('/rest/class/my-class.gson', data, function (res) {
      console.log(res);
      if(res.attribute.data!=null){
         that.setData({
          detaildata: res.attribute.data,
          faceCheckVideoRPS: res.attribute.data.faceCheckVideoRPS,//抓拍控制列表
          videoRPs: res.attribute.data.myClassCourseRPList[indexid].videoRPs,
          myClassCourseRP: res.attribute.data.myClassCourseRPList[indexid]
         })
         
         let myClassCourseRPList=res.attribute.data.myClassCourseRPList;
         
         let lastVideoId = that.data.detaildata.lastVideoId;
         for(let i=0;i<that.data.videoRPs.length;i++){
              if(that.data.videoRPs[i].myClassCourseVideoId == lastVideoId){
                that.setData({
                  videoindexid: i,
                 })
                break;
              }
         }
         console.log("videoindexid---:"+that.data.videoindexid);
         that.setPlay();
         if( Math.floor(that.data.detaildata.studySpeed)>=100){
          that.setData({
            isClassLearnOver: true,
           })
           that.startRefSetInter();
         }else{
          that.setData({
            isClassLearnOver: false,
           })
           that.getNetworkType();
           that.startJYSetInter();
         }
        
        
         that.setData({
          isChechkSuccess: false,
         })
         that.toggle(false);
        
        //  setTimeout(function () {
        //    if(that.data.showDialog==false){
        //     that.setData({
        //       isChechk: true,
        //       showDialog: true
        //     })
        //     that.startSetInter("ca164857-a8c2-444f-a0fe-9d705b97bbfc");         
        //   }
        // }, 15000) 
        
      }
     
    }, function (err) {
      console.log(err);
    });
   },


   getDataRef(){
    let that=this;
    let indexid=this.data.indexid;
    let accountId= wx.getStorageSync('studyAccountId');
    const  data = {
        myClassId: that.data.myClassId,
        accountId: accountId
    };
    train_request.Get('/rest/class/my-class.gson', data, function (res) {
      console.log(res);
      if(res.attribute.data!=null){
         that.setData({
          detaildata: res.attribute.data,
          //faceCheckVideoRPS: res.attribute.data.faceCheckVideoRPS,//抓拍控制列表
          videoRPs: res.attribute.data.myClassCourseRPList[indexid].videoRPs,
          myClassCourseRP: res.attribute.data.myClassCourseRPList[indexid]
         })
         if( Math.floor(that.data.detaildata.studySpeed)>=100){
          that.setData({
            isClassLearnOver: true,
           })
         }else{
          that.setData({
            isClassLearnOver: false,
           })
         }
      }
     
    }, function (err) {
      console.log(err);
    });
   },

   getDataNumRef(){
    let that=this;
    let indexid=this.data.indexid;
    let accountId= wx.getStorageSync('studyAccountId');
    const  data = {
        myClassId: that.data.myClassId,
        accountId: accountId
    };
    train_request.Get('/rest/class/my-class.gson', data, function (res) {
      console.log(res);
      if(res.attribute.data!=null){
        let  faceCheckVideoRPS=res.attribute.data.faceCheckVideoRPS;
        let  videoRPs=res.attribute.data.myClassCourseRPList[indexid].videoRPs;
         that.setData({
          detaildata: res.attribute.data,
          //faceCheckVideoRPS: res.attribute.data.faceCheckVideoRPS,//抓拍控制列表
          videoRPs: res.attribute.data.myClassCourseRPList[indexid].videoRPs,
          myClassCourseRP: res.attribute.data.myClassCourseRPList[indexid]
         })

         //判断每个视频是否需要抓拍
         let checkSuccessNumber=0;
         let videoindexid =that.data.videoindexid; 
         if(faceCheckVideoRPS ==null || faceCheckVideoRPS.length<=0){
          that.setData({
            CheckNum: checkSuccessNumber,
            checkSuccessNumber: checkSuccessNumber,
           });
        }else{
          let videoId= videoRPs[videoindexid].videoId;
          for(let j=0;j<faceCheckVideoRPS.length;j++){
              if(faceCheckVideoRPS[j].videoId ==videoId){
                    checkSuccessNumber =faceCheckVideoRPS[j].checkSuccessNumber;
                    break;
              }
          }
          that.setData({
            CheckNum: checkSuccessNumber,
            checkSuccessNumber: checkSuccessNumber,
           });
        }
        //判断End
        setTimeout(function () {
          that.endSetInter();
          that.setData({
            isChechk: false,
            isChechkSuccess: true,
          })
          that.toggle(true);
        }, 3000) 
        // setTimeout(function () {
        //   that.setData({
           
        //   })
         
        // }, 3000) 
      }
     
    }, function (err) {
      console.log(err);
    });
   },

   getDataZPSuccess(){
    let that=this;
    let indexid=this.data.indexid;
    let accountId= wx.getStorageSync('studyAccountId');
    const  data = {
        myClassId: that.data.myClassId,
        accountId: accountId
    };
    train_request.Get('/rest/class/my-class.gson', data, function (res) {
      console.log(res);
      if(res.attribute.data!=null){
         that.setData({
          detaildata: res.attribute.data,
          faceCheckVideoRPS: res.attribute.data.faceCheckVideoRPS,//抓拍控制列表
          videoRPs: res.attribute.data.myClassCourseRPList[indexid].videoRPs,
          myClassCourseRP: res.attribute.data.myClassCourseRPList[indexid]
         })
        
      }
     
    }, function (err) {
      console.log(err);
    });
   },


   //告诉服务端开始计时
   getvideosv2(){ 
    let that=this;
    let detaildata=this.data.detaildata;
    let videoRPs=this.data.videoRPs;
    let accountId= wx.getStorageSync('studyAccountId');
    let dbNumber = wx.getStorageSync('dbNumber');
    let pid= "myvideo";
    let videoindexid= this.data.videoindexid;
    let vid= videoRPs[videoindexid].videoSource;
    let playduration=this.data.currentTime;//当前播放的时长，单位：秒
    let ts= Date.parse(new Date()); //13位时间戳
    let type = videoRPs[videoindexid].type;
    const  watchInfo = {
        type: type==0?'':1,
        sign: sha1.sha1(pid + vid + playduration + ts +md5.hexMD5(vid).substring(0, 8)),
        vid: vid,
        pid: pid,
        playduration: playduration,
        timestamp: ts,
    };
    let str=JSON.stringify(watchInfo);
    let dataBase = detaildata.myClassId + "%&!" + videoRPs[videoindexid].myClassCourseId 
                  + "%&!" + videoRPs[videoindexid].myClassCourseVideoId
                  + "%&!" + str + "%&!" + dbNumber + "%&!" + accountId;
    let dataAes= aes_util.Encrypt(dataBase);
    const  data = {
        data: dataAes
    };
    console.log("pid---:"+pid);
    console.log("vid---:"+vid);
    console.log("playduration---:"+playduration);
    console.log("ts---:"+ts);
    console.log("md5----hexMD5--substring--:"+md5.hexMD5(vid).substring(0, 8));

    console.log("myClassId---:"+detaildata.myClassId);
    console.log("myClassCourseId---:"+videoRPs[videoindexid].myClassCourseId );
    console.log("myClassCourseVideoId---:"+videoRPs[videoindexid].myClassCourseVideoId );
    console.log("watchInfo---str---:"+str );
    console.log("dbNumber---:"+dbNumber);
    console.log("accountId---:"+accountId);
    console.log("dataBase---:"+dataBase);
    console.log("dataAes---:"+dataAes);
      train_request.Post('/rest/cms/my-video/sv2.gson', data, function (res) {
        console.log(res);
        that.setData({
            isPlaysv2: true
        })
        //sv2成功计时器开始启动
        that.startPlaySetInter();

        if(res.attribute.data!=null){
          // classId: null
          // classLearnRate: 0
          // courseId: null
          // courseLearnRate: 0
          // gotElectiveHours: 0
          // gotRequiredHours: 0
          // myClassId: null
          // respCode: "SUCCESS"
          // respDesc: "success"
          // videoId: null
          // videoLearnRate: 0
        }
       
      }, function (err) {
        that.setData({
          isPlaysv2: false
        })
      that.data.videoCtx.pause();
      wx.showModal({
        title: '提示',
        content: '请求服务端开始学习计时失败，是否重试？',
        showCancel: true,
        confirmText: '重试',
        success: function (res) {
            if (res.confirm) {
              that.setPlay();
              if(that.data.isClassLearnOver==false &&that.data.isWatchOver==false){
                that.getvideosv2();
              }
              that.updatelastvideo();
              
            } else if (res.cancel) {
              
            }
        }
      })
     
        console.log(err);
      });
  },

    //正常计时操作
    getvideocv2(currentTime){
        let that=this;
        let detaildata=this.data.detaildata;
        let videoRPs=this.data.videoRPs;
        let accountId= wx.getStorageSync('studyAccountId');
        let dbNumber = wx.getStorageSync('dbNumber');
        let pid= "myvideo";
        let videoindexid= this.data.videoindexid;
        
        let vid= videoRPs[videoindexid].videoSource;
        let playduration=currentTime;//当前播放的时长，单位：秒
        let ts= Date.parse(new Date()); //13位时间戳
        let type = videoRPs[videoindexid].type;
         
        const  watchInfo = {
            type: type==0?'':1,
            sign: sha1.sha1(pid + vid + playduration + ts +md5.hexMD5(vid).substring(0, 8)),
            vid: vid,
            pid: pid,
            playduration: playduration,
            timestamp: ts,
        };
    
        let str=JSON.stringify(watchInfo);
        let dataBase = detaildata.myClassId + "%&!" + videoRPs[videoindexid].myClassCourseId 
                      + "%&!" + videoRPs[videoindexid].myClassCourseVideoId
                      + "%&!" + str + "%&!" + dbNumber + "%&!" + accountId;
        dataBase += "%&!1";
        let dataAes= aes_util.EncryptCV2(dataBase);
        console.log("pid---:"+pid);
        console.log("vid---:"+vid);
        console.log("playduration---:"+playduration);
        console.log("ts---:"+ts);
        console.log("md5----hexMD5--substring--:"+md5.hexMD5(vid).substring(0, 8));
    
        console.log("myClassId---:"+detaildata.myClassId);
        console.log("myClassCourseId---:"+videoRPs[videoindexid].myClassCourseId );
        console.log("myClassCourseVideoId---:"+videoRPs[videoindexid].myClassCourseVideoId );
        console.log("watchInfo---str---:"+str );
        console.log("dbNumber---:"+dbNumber);
        console.log("accountId---:"+accountId);
        console.log("dataAes---:"+dataAes);
    
        const  data = {
            data: dataAes
        };
        devtrain_request.Post( '/rest/cms/my-video/cv2.gson', data, function (res) {
            console.log(res);
            if(res.attribute!=null && res.attribute.data!=null){
             
              that.setData({
                videoLearnRate: res.attribute.data.videoLearnRate,
                classLearnRate: res.attribute.data.classLearnRate,
                courseLearnRate: res.attribute.data.courseLearnRate,
              });
              that.getDataToJY();
              // classId: null
              // classLearnRate: 0
              // courseId: "7d78ee24-5f77-413b-849d-6f28eccadbf6"
              // courseLearnRate: 0.03
              // gotElectiveHours: 0
              // gotRequiredHours: 0
              // myClassId: "364e5429-086b-4f05-9c5b-295aa8b13d21"
              // respCode: "SUCCESS"
              // respDesc: "正常计时!(success),[12,12,]"
              // videoId: "cb7adf34-98b6-448c-8d2c-e8432efadd99"
              // videoLearnRate: 1.28
            }
           
          }, function (err) {
            console.log(err);
          });
      },

    setPlay(){
        //获取视频播放地址
        let that=this;
        let videoRPs=this.data.videoRPs;
        let videoindexid= this.data.videoindexid;

        let vid = videoRPs[videoindexid].videoSource;
        if(videoRPs[videoindexid].watchTimeLength == videoRPs[videoindexid].duration){
          that.setData({
            isWatchOver:true,
           });
        }
        


        if(videoRPs[videoindexid].watchTimeLength !=null && videoRPs[videoindexid].watchTimeLength!=''){
          if(videoRPs[videoindexid].watchTimeLength ==videoRPs[videoindexid].duration){
            that.setData({
              startplaytime:0,
             });
          }else{
            that.setData({
              startplaytime:videoRPs[videoindexid].watchTimeLength,
             });
          }
         
        }else{
           that.setData({
            startplaytime:0,
           });
        }
        
        that.setData({
          video_real_time: that.data.startplaytime,
         });
         console.log("--------video_real_time---:"+that.data.video_real_time);


         //判断每个视频是否需要抓拍
         let checkSuccessNumber=0;
         if(that.data.faceCheckVideoRPS ==null || that.data.faceCheckVideoRPS.length<=0){
          that.setData({
            CheckNum: checkSuccessNumber,
            checkSuccessNumber: checkSuccessNumber,
            unCheckFaceListShow: null,
           });
        }else{
          let videoId= videoRPs[videoindexid].videoId;
          let unCheckFaceListShow=null;
          
          for(let j=0;j<that.data.faceCheckVideoRPS.length;j++){
              if(that.data.faceCheckVideoRPS[j].videoId ==videoId){
                    unCheckFaceListShow=that.data.faceCheckVideoRPS[j].unCheckFaceList;
                    checkSuccessNumber =that.data.faceCheckVideoRPS[j].checkSuccessNumber;
                    break;
              }
          }
          that.setData({
            CheckNum: checkSuccessNumber,
            checkSuccessNumber: checkSuccessNumber,
            unCheckFaceListShow: unCheckFaceListShow,
           });
        }
        //判断End


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
                src: videoInfo.src[0]
              });
              console.log("srcUrl:"+that.data.src);
          }
        };
        this.player = polyv.getVideo(vidObj);
       
    },

    startPlay: function(e) {
        // let pid= e.currentTarget.id
        console.log("--------startPlay（）---------");
        this.setData({
          changeVideo: false
        })
        this.endSetInter();
        this.endPlaySetInter();
        this.endKZSetInter();
        this.setData({ 
          isChechk: false,
        });
        let that=this;
        let videoRPs=this.data.videoRPs;
        let videoindexid= this.data.videoindexid;
        if(videoRPs[videoindexid].watchTimeLength == videoRPs[videoindexid].duration){
          that.setData({
            isWatchOver:true,
           });
        }


        if(this.data.isClassLearnOver==false && this.data.isWatchOver==false){
          this.getvideosv2();
        }
        
        this.updatelastvideo();

      
        //   setTimeout(function () {
        //    if(that.data.showDialog==false){
        //     that.setData({
        //       isChechk: true,
        //       showDialog: true
        //     })
        //     that.startSetInter("ca164857-a8c2-444f-a0fe-9d705b97bbfc");         
        //   }
        // }, 5000) 

    },
    stopPlay(){
      console.log("--------stopPlay---------");
      this.setData({
        isPlaysv2: false
     })
      this.endSetInter();
      this.endPlaySetInter();
      this.endKZSetInter();
      this.setData({ 
         isChechk: false,
      });
    },

    goDetail: function(e) {
       this.setData({
        changeVideo: true
       })
       this.data.videoCtx.pause();
       this.endKZSetInter();
       this.endSetInter();
       this.endPlaySetInter();
       this.setData({
        isPlaysv2: false
       })
        let index = e.currentTarget.dataset.id;
        let pid= e.currentTarget.id
      
        this.setData({
            video_real_time:0,
            checkSuccessNumber:0,
            isWatchOver:false,
            startplaytime:0,
            numPlay:0,
            num:10,
            setInter:'',//存储计时器

            unCheckvideoRateid:0,//为通过的抓拍的进度值位置
            isChechk:false,
            unCheckNum:0,//抓拍失败次数
            CheckNum:0,//抓拍成功次数

            videoLearnRate:0,//当前视频已学习的时长
            classLearnRate:0,//当前班级已学习的进度
            courseLearnRate:0,//当前课程已学习的进度

         
            showDialog:false,
            isPlaysv2:false,//sv2是否请求成功了
            currentTime:0,
            playduration:0,
            videoindexid:index,
            showDialogERROR:false,
            autoplay:false,
        });
        
         
        

        





        this.setPlay();
       
        if(this.data.autoplay==true &&  this.data.isClassLearnOver==false && this.data.isWatchOver==false){
          this.getvideosv2();
        }
        this.updatelastvideo();
    },

       //更新最后播放视频
     updatelastvideo(){
        let that=this;
        let detaildata=this.data.detaildata;
        let videoRPs=this.data.videoRPs;
        let accountId= wx.getStorageSync('studyAccountId');
        let videoindexid= this.data.videoindexid;
    
        const  data = {
            myClassId: detaildata.myClassId,
            myClassCourseId: videoRPs[videoindexid].myClassCourseId,
            myClassCourseVideoId: videoRPs[videoindexid].myClassCourseVideoId,
            accountId: accountId
        };
          train_request.Post('/rest/cms/my-video/update-last-video.gson', data, function (res) {
            console.log(res);
            // if(res.attribute.data!=null){
              
            // }
           
          }, function (err) {
            console.log(err);
          });
      },


      takePhoto(faceCheckId) {
        const ctx = wx.createCameraContext()
        var that = this
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                console.log(res.tempImagePath)
                that.updatefacecheckstatus(faceCheckId,res.tempImagePath);
                // setTimeout(function () {
                 
                //   // that.setData({
                //   //   showDialog: false
                //   // })
                // }, 0)  
               
                 
            },
            fail: (err) => {
              console.log(err)
              wx.showToast({
                title: '未检测到人脸',
                 icon: 'none',
                duration: 3500
              })
              that.setData({
                isChechkSuccessNum: false,
              })
              let unCheckNum=that.data.unCheckNum+1;
              that.setData({
                unCheckNum: unCheckNum
              })
              if(that.data.unCheckNum>=3){
                that.setData({
                  showDialog: false,
                })
              }
              setTimeout(function () {
                that.endSetInterFail();
                that.endKZSetInter();
                that.startKZSetInter(faceCheckId);
              }, 4000) 
            }
        })
    },
    error(e) {
        console.log(e.detail)
        // that.setData({
        //     showDialog: false
        // })
    },
    startdrawCanvas(){
      console.log('相机初始化成功')
    },


    //抓拍
    updatefacecheckstatus(faceCheckId,tempFilePath){
        let that=this;
        let classId=this.data.classId;
        let myClassId=this.data.myClassId;
        let accountId= wx.getStorageSync('studyAccountId');
        if(tempFilePath ==null || tempFilePath==''){
          wx.showToast({
            title: '未检测到人脸',
             icon: 'none',
            duration: 3500
          })
          that.setData({
            isChechkSuccessNum: false,
          })
          let unCheckNum=that.data.unCheckNum+1;
          that.setData({
            unCheckNum: unCheckNum
          })
          if(that.data.unCheckNum>=3){
            that.setData({
              showDialog: false,
            })
          }
          setTimeout(function () {
            that.endSetInterFail();
            that.endKZSetInter();
            that.startKZSetInter(faceCheckId);
          }, 4000) 
          return;
        }else {
       
          wx.uploadFile({
            url: app.globalData.TRAIN_URL+'/rest/faceCheck/update-face-check-status.gson', //此处换上你的接口地址
            
            filePath: tempFilePath,
            name: 'multipartFile',
            formData: {  
                faceCheckId: faceCheckId,
                checkTimeLength: Math.floor(this.data.currentTime),
                classRate: this.data.classLearnRate
            },  
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'apiToken': 'Xl4KHyN2zesyVFpTguruyAvdT/3yDH5jL35QMHmXM0VKwa8tINBFRQRi7FV9JAgMMjEjP9/zlY2yk88DLsRAUQ=='
            },
            success: function (res) {
                console.log(res);
                console.log("base_request---:"+JSON.stringify(res));
                let data = JSON.parse(res.data); // 这个很关键
                console.log(data);
                if(data.respCode==200){
                  that.setData({ numKZ: 1 });  
                  //let CheckNum1=that.data.CheckNum+1;
                  let unCheckvideoRateid1=that.data.unCheckvideoRateid+1;
                  that.setData({
                    unCheckNum: 0,
                    // showDialog: false,
                    unCheckvideoRateid: unCheckvideoRateid1,
                    // CheckNum: CheckNum1,
                    // ChechkSuccessNum: CheckNum1,
                  })
                  
                  wx.showToast({
                    title: data.respDesc,
                    icon: 'none',
                    duration: 3500
                  })
                  that.setData({
                    isChechkSuccessNum: true,
                  })
                  that.getDataNumRef();
                 // that.data.videoCtx.play();
                  
                  

                  

                  

                }else{
                 
                  that.setData({
                    isChechkSuccessNum: false,
                  })
                  // that.setData({
                  //   showDialog: false
                  // })
                  wx.showToast({
                    title: data.respDesc,
                    icon: 'none',
                    duration: 3500
                  })
               
                 // that.data.videoCtx.pause();

                  let unCheckNum=that.data.unCheckNum+1;
                  that.setData({
                    unCheckNum: unCheckNum
                  })
                  if(that.data.unCheckNum>=3){
                    that.setData({
                      showDialog: false,
                    })
                  }

                  setTimeout(function () {
                   that.endSetInterFail();
                   that.endKZSetInter();
                   that.startKZSetInter(faceCheckId);
                   that.showModalErr();
                  }, 4000) 

                }
               
            },  
            fail: function (res) {  
              //处理失败时的逻辑
              // that.setData({
              //   showDialog: false
              // })
              wx.showToast({
                title: '抓拍失败',
                icon: 'none',
                duration: 3500
              })
              that.setData({
                isChechkSuccessNum: false,
              })
             // that.data.videoCtx.pause();

              let unCheckNum=that.data.unCheckNum+1;
              that.setData({
                unCheckNum: unCheckNum
              })
              if(that.data.unCheckNum>=3){
                that.setData({
                  showDialog: false,
                })
              }
              
              setTimeout(function () {
                that.endSetInterFail();
                that.endKZSetInter();
                that.startKZSetInter(faceCheckId);
              }, 4000) 
              
            }  
          })
  
        }
    },

  showModalErr() {
    
  },

  hideModalERROR() {
     this.setData({
       showDialogERROR: false,
     })
     wx.setStorageSync('isRenLianCheckSuss', '0');
     wx.navigateTo({
      url: "/pages/open-study/authentication/index?isRenLianCheck=true&classId=" + this.data.classId+"&myClassId=" + this.data.myClassId 
              +"&faceCheckId=" + this.data.faceCheckId+"&classLearnRate=" + this.data.classLearnRate+"&currentTime=" + this.data.currentTime
   })
  },
  hideModalERRORZC() {
    this.setData({
      isRenLianCheckSuss: true,
    })
    wx.setStorageSync('isRenLianCheckSuss', '0');
    wx.navigateTo({
      url: "/pages/open-study/authentication/index?isRenLianCheck=true&classId=" + this.data.classId+"&myClassId=" + this.data.myClassId
             +"&faceCheckId=" + this.data.faceCheckId+"&classLearnRate=" + this.data.classLearnRate+"&currentTime=" + this.data.currentTime
    })
  },

  endOver: function(e)  {
    if(this.data.isAutoNextVideo==1){
      let index =this.data.videoindexid+1;
      if(index > (this.data.videoRPs.length-1)){
          return;
      }
      this.endSetInter();
      this.endPlaySetInter();
       this.setData({
           video_real_time:0,
           checkSuccessNumber:0,
           isWatchOver:false,
           startplaytime:0,
           numPlay:0,
           num:10,
           setInter:'',//存储计时器

           unCheckvideoRateid:0,//为通过的抓拍的进度值位置
           isChechk:false,
           unCheckNum:0,//抓拍失败次数
           CheckNum:0,//抓拍成功次数

           videoLearnRate:0,//当前视频已学习的时长
           classLearnRate:0,//当前班级已学习的进度
           courseLearnRate:0,//当前课程已学习的进度

        
           showDialog:false,
           isPlaysv2:false,//sv2是否请求成功了
           currentTime:0,
           playduration:0,
           videoindexid:index,
           showDialogERROR:false,
           autoplay:false,
       });
       
       this.setPlay();
       if(this.data.isClassLearnOver==false && this.data.isWatchOver==false){
        this.getvideosv2();
       }
     
       this.updatelastvideo();
       this.setData({
        autoplay:true,
       });
       
    }
  
  },



  getDataToJY(){
    let that=this;
    let indexid=this.data.indexid;
    let accountId= wx.getStorageSync('studyAccountId');
    const  data = {
        myClassId: that.data.myClassId,
        accountId: accountId
    };
    this.setData({
      config: app.globalData.config,
    });
    train_request.Get('/rest/class/my-class.gson', data, function (res) {
      console.log(res);
      if(res.attribute.data!=null){

        that.setData({
          detaildata: res.attribute.data,
          //faceCheckVideoRPS: res.attribute.data.faceCheckVideoRPS,//抓拍控制列表
          videoRPs: res.attribute.data.myClassCourseRPList[indexid].videoRPs,
          myClassCourseRP: res.attribute.data.myClassCourseRPList[indexid]
         })
         if( Math.floor(that.data.detaildata.studySpeed)>=100){
          that.setData({
            isClassLearnOver: true,
           })
         }else{
          that.setData({
            isClassLearnOver: false,
           })
         }

          let detaildata=res.attribute.data;
         if(that.data.config.show_train_complete==1  && Math.floor(detaildata.studySpeed)==100){//&&res.attribute.data.status==2
              //that.queryuncommittedclass(detaildata);//不能靠接口触发
            if( detaildata.classId != that.data.configBean.generalCoursesClassId ){
              let cardNum = wx.getStorageSync('cardNum');
              let mobile = wx.getStorageSync('mobile');
              let realName = wx.getStorageSync('realName');    
  
              let className = detaildata.className;
              let classId   = detaildata.classId ;
              that.setData({
                jyclassId:      classId,
                gz:      className ,
                cardNum:  cardNum,
                phone:  mobile,
                name:  realName,
                showJYDialog:  true,
              })
            }
            
         }
      }
     
    }, function (err) {
      console.log(err);
    });
   },
  
   //获取是否有学习完的班级未提交结业申请
  queryuncommittedclass(detaildata){
    let that=this;
    let accountId= wx.getStorageSync('studyAccountId');
    let cardNum = wx.getStorageSync('cardNum');
    let mobile = wx.getStorageSync('mobile');
    let realName = wx.getStorageSync('realName');       
    const  chdata = {
      accountId: accountId
    };
    this.setData({
      configBean: app.globalData.configBean,
    });
    dev_request.Get('/v1/app/query-uncommitted-class.gson', chdata, function (res) {
      console.log(res);
      if(res.attribute.data!=null && res.attribute.data.length>0){
          that.setData({
             uncommittedList:  res.attribute.data
          })
         for(let i=0;i<res.attribute.data.length;i++){
          if( res.attribute.data[i].classId != that.data.configBean.generalCoursesClassId &&
                  res.attribute.data[i].classId==detaildata.classId){
            that.setData({
              uncommittedIndex:  i
            })
            
            let className = res.attribute.data[i].className;
            let classId   = res.attribute.data[i].classId ;
            that.setData({
              jyclassId:      classId,
              gz:      className ,
              cardNum:  cardNum,
              phone:  mobile,
              name:  realName,
              showJYDialog:  true,
            })

            break;
          }
         }
        
        
      }
      
     
    }, function (err) {
      console.log(err);
     
    });
  },
   
  //结业申请--填写
  savezhengzhoumessage(){
    let that=this;
    if(that.data.name ==null || that.data.name ==''){
      wx.showToast({
        title: '请输入姓名',
         icon: 'none',
        duration: 3500
      })
      return;
    }

    if(that.data.phone ==null || that.data.phone ==''){
      wx.showToast({
        title: '请输入联系电话',
         icon: 'none',
        duration: 3500
      })
      return;
    }

    if(that.data.gz ==null || that.data.gz ==''){
      wx.showToast({
        title: '请输入学习及考试工种',
         icon: 'none',
        duration: 3500
      })
      return;
    }


    if(that.data.gzdj ==null || that.data.gzdj ==''){
      wx.showToast({
        title: '请输入学习及考试工种等级',
         icon: 'none',
        duration: 3500
      })
      return;
    }
    if(that.data.planExamTime ==null || that.data.planExamTime ==''){
      wx.showToast({
        title: '请选择预计参加考试时间',
         icon: 'none',
        duration: 3500
      })
      return;
    }


    const  chdata = {
      classId:  that.data.jyclassId,
      accountName: that.data.name,
      cardNumber: that.data.cardNum,
      mobile: that.data.phone,
      profession: that.data.gz,
      professionLevel: that.data.gzdj,
      planExamTime: that.data.planExamTime,
      remark: that.data.bz,
    };
    wx.showLoading({
      title: '努力加载中',
      mask: true
    });
    train_request.Post('/class/save-zheng-zhou-message.gson', chdata, function (res) {
      console.log(res);
      wx.hideLoading();
      if(res.attribute!=null){
      }
      
      setTimeout(function () {
        wx.showToast({
          title: '提交成功',
           icon: 'none',
          duration: 3500
        })
      }, 100)
      that.setData({
        jyclassId: null,
        name: null,
        phone:  null,
        gz: null,
        gzdj: null,
        bz: null,
        uncommittedList: null,
        uncommittedIndex:  -1,
        showJYDialog:  false,
      })
      
      that.endJYSetInter();
      that.endRefSetInter();
      that.startRefSetInter();
    }, function (err) {
      console.log(err);
      wx.hideLoading();
    });
  },
   
  radioChange:function(e) {
       console.log('点击的是第'+e.detail.value+'个radio')
       this.setData({
            planExamTime: e.detail.value
       })   
    
  },

  nameInput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },

  gzInput:function(e){
    this.setData({
      gz: e.detail.value
    })
  },

  gzdjInput:function(e){
    this.setData({
      gzdj: e.detail.value
    })
  },
  bzInput:function(e){
    this.setData({
      bz: e.detail.value
    })
  },


  toggle(isRef) {
   
    var that = this;
    that.setData({
      animation: 'slide-right',
      animationShow:true,
    })
    setTimeout(function() {
      that.setData({
        animation: '',
        animationShow:false,
        isChechkSuccess: false,
      })
     
      if(isRef==true){
        that.getDataZPSuccess();
      }
    }, 3000)
    
  },

  screenChange(e){
    let that=this;
    let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
    this.setData({
      fullScreen: fullScreen
    })
    if(fullScreen){
      this.setData({
        fullScreen1: true
      })
      setTimeout(function () {
        that.setData({
          fullScreen2: true,
         })
      }, 300) 
    }else{
      this.setData({
        fullScreen2: false
      })
      setTimeout(function () {
        that.setData({
          fullScreen1: false,
         })
      }, 300) 
    }
    
  },

  getNetworkType(){
    let that=this;
    wx.onNetworkStatusChange(function(res) {
      if (res.networkType == 'none') {
        //没网了，存个没网标识，然后需要请求的地方加个loding框
       if(that.data.isNetworkStatusError==false){
        that.setData({
          isNetworkStatusError: true
        })
        wx.showModal({
          title: '提示',
          content: '当前网络连接中断，继续学习将不计入时长',
          showCancel: false,
          confirmText: '知道了',
          success: function (res) {
              if (res.confirm) {
              
                that.endSetInter();
                that.endKZSetInter();
                that.endPlaySetInter();
                that.setData({ 
                  isChechk: false,
                });
                that.setData({
                  isNetworkStatusError: false
                })
              } else if (res.cancel) {
                
              }
          }
        })
       }
        
      } else {
        //有网了以后，清空没网标识，进行页面刷新数据请求等...
        // if(that.data.isNetworkStatusOk==false){
        //   that.setData({
        //     isNetworkStatusOk: true
        //   })
        //   wx.showModal({
        //     title: '提示',
        //     content: '网络回复正常，继续学习将计入时长',
        //     showCancel: false,
        //     confirmText: '知道了',
        //     success: function (res) {
        //         if (res.confirm) {
        //           that.setPlay();
        //           if(that.data.isWatchOver==false){
        //             that.getvideosv2();
        //           }
        //           that.updatelastvideo();
        //           that.setData({
        //             isNetworkStatusOk: false
        //           })
        //         } else if (res.cancel) {
                  
        //         }
        //     }
        //   })
         
        // }
       
       
          
      }

    })


    // wx.getNetworkType({
    //   success: function(res) {
    //     const networkType = res.networkType
    //     if ('none' != networkType) {
    //       //有网，然后接着监听网络状态
        
          
    //     } else {
    //       //没网，监听网络状态
    //       wx.onNetworkStatusChange(function(res) {
    //         if (res.isConnected) {
    //             //有网了以后，
    //             if(that.data.isNetworkStatusOk==false){
    //               that.setData({
    //                 isNetworkStatusOk: true
    //               })
    //               wx.showModal({
    //                 title: '提示',
    //                 content: '网络回复正常，继续学习将计入时长',
    //                 showCancel: false,
    //                 confirmText: '知道了',
    //                 success: function (res) {
    //                     if (res.confirm) {
    //                       that.setPlay();
    //                       if(that.data.isWatchOver==false){
    //                         that.getvideosv2();
    //                       }
    //                       that.updatelastvideo();
    //                       that.setData({
    //                         isNetworkStatusOk: false
    //                       })
    //                     } else if (res.cancel) {
                          
    //                     }
    //                 }
    //               })
    //             }
               
    //         } else {
    //            //没网了
    //            if(that.data.isNetworkStatusError==false){
    //             that.setData({
    //               isNetworkStatusError: true
    //             })
    //             wx.showModal({
    //               title: '提示',
    //               content: '当前网络连接中断，继续学习将不计入时长',
    //               showCancel: false,
    //               confirmText: '知道了',
    //               success: function (res) {
    //                   if (res.confirm) {
                     
    //                     that.endSetInter();
    //                     that.endKZSetInter();
    //                     that.endPlaySetInter();
    //                     that.setData({
    //                       isNetworkStatusError: false
    //                     })
    //                   } else if (res.cancel) {
                        
    //                   }
    //               }
    //             })
    //            }
              
    //         }

    //       })
    //     }
    //   },
    // })
  },

})