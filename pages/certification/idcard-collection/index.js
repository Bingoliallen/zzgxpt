// pages/certification/idcard-collection/index.js
const dev_request = require('../../../utils/dev_request.js')
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: '',
        show: false,
        isRegister:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var _obj=options.isRegister;        
      this.setData({
        isRegister: _obj 
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
    
    saveImg () {
        wx.showModal({
          title: '图片地址',
          content: this.data.src,
        })
    },

    takePhoto() {
        const ctx = wx.createCameraContext()
        const listener = ctx.onCameraFrame((frame) => {
          console.log(frame)
        })
        ctx.takePhoto({
          quality: 'high',
          success: (res) => {
            console.log(res)
            this.setData({
              src: res.tempImagePath,
              show: true
            })
            this.uploadfile();

            listener.stop({
              success: (res) => {
                console.log(res)
              },
              fail: (err) =>{
                console.log(err)
                wx.showModal({
                  title: '提示',
                  content: '请先拍摄身份证正面照',
                })
              }
            })
          },
          fail: (err) => {
            console.log(err)
            wx.showModal({
              title: '提示',
              content: '请先拍摄身份证正面照',
            })
          }
        })
    },


    
    uploadfile(){
      let that = this;
      let tempFilePath=this.data.src;
      if(tempFilePath ==null || tempFilePath==''){
        wx.showToast({
          title: '请先拍摄身份证正面照',
           icon: 'none',
          duration: 3500
        })
        return;
      
      }else {
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });

        wx.uploadFile({
          url: app.globalData.DEV_URL+'/v1/app/upload-file.gson', //此处换上你的接口地址 
          filePath: tempFilePath,
          name: 'file',
          header: {
              // "Content-Type": "multipart/form-data",
              'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
              console.log(res);
              console.log("base_request---:"+JSON.stringify(res));
              wx.hideLoading();
              let data = JSON.parse(res.data); // 这个很关键
              console.log(data);
              if(data.respCode==200){
                console.log(data.attribute.data);

                that.getidcardinfo(data.attribute.data);

               





              }else{
                setTimeout(function () {
                  wx.showToast({
                    title: data.respDesc,
                    icon: 'none',
                    duration: 3500
                  })
                }, 100)
               
              }
              // that.setData({
              //     worksImgs: worksImgs
              // })
          },  
          fail: function (res) {  
            wx.hideLoading();
            
            setTimeout(function () {
              wx.showToast({
                title: '上传图片失败',
                 icon: 'none',
                duration: 3500
              })
            }, 100)
          }  
        })

      }
     
    },


    //识别身份证照片文字信息
    getidcardinfo(sfzurl){
        let that=this;
        let cardNum= wx.getStorageSync('cardNum');
        if(sfzurl !=null){
          let  data = null;
          if(that.data.isRegister==true){
            data = {
              url: sfzurl,
              cardNum: ""
            };
          }else{
            if(cardNum==null || cardNum==''){
              data = {
                url: sfzurl,
                cardNum: ""
              };
            }else{
              data = {
                url: sfzurl,
                cardNum: cardNum 
              };
            }
            
          }
         
          dev_request.Get('/v1/app/get-idcard-info.gson', data, function (res) {
            console.log(res);
            if(res.attribute.data!=null){
                 let  cardNumber = res.attribute.data.cardNum;
                 if(that.data.isRegister==true || (cardNum==null || cardNum=='')){
                  var pages = getCurrentPages(); // 获取页面栈
                  var currPage = pages[pages.length - 1]; // 当前页面
                  var prevPage = pages[pages.length - 2]; // 上一个页面
                  prevPage.setData({
                    src: that.data.src,
                    sfzurl: sfzurl // 数据
                  })
                  wx.navigateBack({
                    delta: 1
                  })
                 }else{
                  if(cardNum == cardNumber){
                    var pages = getCurrentPages(); // 获取页面栈
                    var currPage = pages[pages.length - 1]; // 当前页面
                    var prevPage = pages[pages.length - 2]; // 上一个页面
                    prevPage.setData({
                      src: that.data.src,
                      sfzurl: sfzurl // 数据
                    })
                    wx.navigateBack({
                      delta: 1
                    })
                   }else{
                    wx.showToast({
                      title: '上传的身份证照片与注册信息不一致',
                       icon: 'none',
                      duration: 3500
                    })
                    that.setData({
                      src: null,
                      show: false
                    })
                   }
                 }
                 
            }else{
              wx.showToast({
                title: '未识别到识别身份证照片信息',
                 icon: 'none',
                duration: 3500
              })
              that.setData({
                src: null,
                show: false
              })
            }
           

          }, function (err) {
            console.log(err);
            that.setData({
              src: null,
              show: false
            })

          });
        }else{
          wx.showToast({
            title: '未识别到身份证照片信息',
             icon: 'none',
            duration: 3500
          })
          that.setData({
            src: null,
            show: false
          })
        }
    },


})