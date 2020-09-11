// pages/open-study/authentication/index.js
const dev_request = require('../../../utils/dev_request.js')
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isRenLianCheck: false,

        showDialogErr: false,
        isFirst:true,//是否第一次进入页面

        checfacek: false,//是否失败成功
        errmsg:'',

        myClassId:null,
        classId:null,
        count: 0, // 设置 计数器 初始为0
        countTimer: null, // 设置 定时器 初始为null
        complete: false,//计时完成
   
        textmsg:'开始识别',//识别中，请稍候
        first:true,
        showDialog:false,
        setInter:'',//存储计时器
        num:4,
        nummsg:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let isRenLianCheck1=options.isRenLianCheck;   
      var _obj=options.classId;     
      var myClassId=options.myClassId;   
      let faceCheckId=options.faceCheckId;   
      let classLearnRate=options.classLearnRate;   
      let currentTime=options.currentTime;       
      this.setData({
        isRenLianCheck: isRenLianCheck1,
        classId: _obj,
        myClassId: myClassId,
        faceCheckId: faceCheckId,
        classLearnRate: classLearnRate,
        currentTime: currentTime,
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
        var that =this;
       
        //that.startSetInter();
        if(this.data.isFirst==true){
            this.setData({
              isFirst: false
            })
            this.initCaream();
        }else{
  
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
        var that =this;
        //清除计时器  即清除setInter
        clearInterval(that.data.setInter)
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


    startSetInter: function(){
        var that = this;
        //将计时器赋值给setInter
        that.data.setInter = setInterval(
            function () {
                var numVal = that.data.num - 1;
                that.setData({ num: numVal });
                console.log('setInterval==' + that.data.num);
                if(that.data.num==7){
                    //that.showModal();
                }
                if(that.data.num==6){
                    that.setData({ first: false });
                }else if(that.data.num<=0){
                    that.endSetInter();
                   
                }
            }
      , 1000);   
    },

    endSetInter: function(){
        var that = this;
        //清除计时器  即清除setInter
        clearInterval(that.data.setInter)
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















    takePhoto() {
        const ctx = wx.createCameraContext()
        var that = this
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                console.log(res.tempImagePath)
                let isRenLianCheckSuss =  wx.getStorageSync('isRenLianCheckSuss');
                if(isRenLianCheckSuss=='0'){
                  this.updatefacecheckstatus(res.tempImagePath);
                }else{
                  this.uploadfile(res.tempImagePath);
                }
               
                
            },
            fail: (err) => {
              console.log(err)
              that.setData({ 
                checfacek: false,
                errmsg: '识别失败，若佩戴眼镜请摘掉并重新对准识别区域',
              });
            
              that.showModalErr();
            }
        })
    },
    error(e) {
        console.log(e.detail)
    },
    startdrawCanvas(){
      console.log('相机初始化成功')
    },
   
    
    drawProgressbg: function () {
      // 使用 wx.createContext 获取绘图上下文 context
      var ctx = wx.createCanvasContext('canvasProgressbg')
      ctx.setLineWidth(10); // 设置圆环的宽度
      ctx.setStrokeStyle('#a9a9a9'); // 设置圆环的颜色
      ctx.setLineCap('round') // 设置圆环端点的形状
      ctx.beginPath(); //开始一个新的路径
      ctx.arc(140, 140, 120, 0, 2 * Math.PI, false);
      //设置一个原点(100,100)，半径为90的圆的路径到当前路径
      ctx.stroke(); //对当前路径进行描边
      ctx.draw();
    },
    drawCircle: function (step) {
      var context = wx.createCanvasContext('canvasProgress');
      // 设置渐变
      var gradient = context.createLinearGradient(200, 100, 100, 200);
      gradient.addColorStop("0", "#2661DD");
      gradient.addColorStop("0.5", "#2661DD");
      gradient.addColorStop("1.0", "#2661DD");
      context.setLineWidth(10);
      context.setStrokeStyle(gradient);
      context.setLineCap('round')
      context.beginPath();
      // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
      context.arc(140, 140, 120, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
      context.stroke();
      context.draw()
    },
    countInterval: function () {
      // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
      this.countTimer = setInterval(() => {
        if (this.data.count <= 8) {
          /* 绘制彩色圆环进度条
          注意此处 传参 step 取值范围是0到2，
          所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
          */
          this.drawCircle(this.data.count / (8 / 2))
          this.data.count++;
        }else {
          this.setData({
            complete: true
          });
          clearInterval(this.countTimer);
        } 
        if(this.data.count ==5){
          this.takePhoto();
        }
        if (this.data.count > 2 && this.data.count <= 4) {
          this.setData({ 
            first: false 
          });
          
        }else if (this.data.count > 4 && this.data.count <= 8) {
          var numVal = this.data.num - 1;
          this.setData({ num: numVal });
          this.setData({ 
            textmsg: '识别中，请稍候' ,
            nummsg:numVal+'s'
          });
        }
      }, 1000)
    },
   



    //上传人脸识别抓拍
    uploadfile(tempFilePath){
      let that = this;
      let classId=this.data.classId;
      let myClassId=this.data.myClassId;
      let accountId= wx.getStorageSync('studyAccountId');
      if(tempFilePath ==null || tempFilePath==''){
        // wx.showToast({
        //   title: '未检测到人脸',
        //    icon: 'none',
        //   duration: 3500
        // })
        that.setData({ 
          checfacek: false,
          errmsg: '识别失败，若佩戴眼镜请摘掉并重新对准识别区域',
        });
        that.showModalErr();
        return;
      }else {
     
        wx.uploadFile({
          url: app.globalData.TRAIN_URL+'/rest/cms/paper/check-face-by-paper.gson', //此处换上你的接口地址
          
          filePath: tempFilePath,
          name: 'faceFile',
          formData: {  
            classId: classId,
            accountId: accountId
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
                that.setData({ 
                  checfacek: true 
                });
                wx.showToast({
                  title: data.respDesc,
                  icon: 'none',
                  duration: 3500
                })
                 setTimeout(function () {
                    let isRenLianCheckSuss =  wx.getStorageSync('isRenLianCheckSuss');
                   if(isRenLianCheckSuss=='0'){
                    var pages = getCurrentPages(); // 获取页面栈
                    var currPage = pages[pages.length - 1]; // 当前页面
                    var prevPage = pages[pages.length - 2]; // 上一个页面
                    let unCheckvideoRateid1=prevPage.data.unCheckvideoRateid+1;
                    wx.setStorageSync('isRenLianCheckSuss', '1');
                    prevPage.setData({
                      unCheckNum: 0,
                       unCheckvideoRateid: unCheckvideoRateid1,
                      isChechk: false,
                    })
                    wx.navigateBack({
                      delta: 1
                    })
                   }else{
                    wx.redirectTo({
                      url: "/pages/course-learn/index?classId="+classId+"&myClassId=" + myClassId
                     
                    })
                   }
                
                }, 1000)
              }else{
                that.setData({ 
                  checfacek: false,
                  errmsg: '识别失败，若佩戴眼镜请摘掉并重新对准识别区域',
                });
              
                that.showModalErr();
              }
             
          },  
          fail: function (res) {  
           
            //处理失败时的逻辑
            that.setData({ 
              checfacek: false,
              errmsg: '识别失败，若佩戴眼镜请摘掉并重新对准识别区域',
            });
           
            
            that.showModalErr();
          }  
        })

      }
     
    },

    updatefacecheckstatus(tempFilePath){
      let that = this;
      let faceCheckId=this.data.faceCheckId;
      let currentTime=this.data.currentTime;
      let classLearnRate= this.data.classLearnRate;
      if(tempFilePath ==null || tempFilePath==''){
        // wx.showToast({
        //   title: '未检测到人脸',
        //    icon: 'none',
        //   duration: 3500
        // })
        that.setData({ 
          checfacek: false,
          errmsg: '识别失败，若佩戴眼镜请摘掉并重新对准识别区域',
        });
        that.showModalErr();
        return;
      }else {
     
        wx.uploadFile({
          url: app.globalData.TRAIN_URL+'/rest/faceCheck/update-face-check-status.gson', //此处换上你的接口地址
          
          filePath: tempFilePath,
          name: 'multipartFile',
          formData: {  
            faceCheckId: faceCheckId,
            checkTimeLength: Math.floor(currentTime),
            classRate: classLearnRate
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
                that.setData({ 
                  checfacek: true 
                });
                wx.showToast({
                  title: data.respDesc,
                  icon: 'none',
                  duration: 3500
                })
                 setTimeout(function () {
                  var pages = getCurrentPages(); // 获取页面栈
                  var currPage = pages[pages.length - 1]; // 当前页面
                  var prevPage = pages[pages.length - 2]; // 上一个页面
                  let unCheckvideoRateid1=prevPage.data.unCheckvideoRateid+1;
                  wx.setStorageSync('isRenLianCheckSuss', '1');
                  prevPage.setData({
                    numKZ: 1,
                    unCheckNum: 0,
                    unCheckvideoRateid: unCheckvideoRateid1,
                    isChechkSuccessNum: true,
                  })
                  wx.navigateBack({
                    delta: 1
                  })
                
                }, 1000)
              }else{
                that.setData({ 
                  checfacek: false,
                  errmsg: '识别失败，若佩戴眼镜请摘掉并重新对准识别区域',
                });
              
                that.showModalErr();
              }
             
          },  
          fail: function (res) {  
           
            //处理失败时的逻辑
            that.setData({ 
              checfacek: false,
              errmsg: '识别失败，若佩戴眼镜请摘掉并重新对准识别区域',
            });
           
            
            that.showModalErr();
          }  
        })

      }
     
    },


    initCaream(){
      if (wx.createCameraContext()) {
        this.cameraContext = wx.createCameraContext('myCamera')
        this.drawProgressbg();
        // this.drawCircle();
        this.countInterval();
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    },

   showModalErr() {
        this.setData({
          showDialogErr: true
        })
    },
    hideModalErr(e) {
        this.setData({
          showDialogErr: false
        })
        if(this.data.checfacek==false){
          wx.navigateBack({
            delta: 1
          })
        }
    },
    hideModalCry(e) {
        this.setData({
          showDialogErr: false
        })
        clearInterval(this.countTimer);
        this.setData({ 
          count: 0, // 设置 计数器 初始为0
          complete: false,//计时完成
          textmsg:'开始识别',//识别中，请稍候
          num:4,
          first:true,
          nummsg:'',
        });

        
        this.initCaream();

    },

})