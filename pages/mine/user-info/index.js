// pages/mine/user-info/index.js
const dev_request = require('../../../utils/dev_request.js')
const train_request = require('../../../utils/train_request.js')
const app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        headPhoto:null,
        imgList: [],
        realName: '', 
        sex: -1,
        cardNum: '',
        idCardPhoto: '',
        imgUrl: app.globalData.imgUrl,
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
       //this.initData();
       this.getstuinfo();
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

    initData(){
        let  realName= wx.getStorageSync('realName');
        let  sex= wx.getStorageSync('sex');
        let  cardNum= wx.getStorageSync('cardNum');
        let  idCardPhoto= wx.getStorageSync('idCardPhoto');
        this.setData({
            realName: realName, 
            sex: sex,
            cardNum: cardNum,
            idCardPhoto: idCardPhoto,
          })

    },


     //获取个人信息
     getstuinfo(){
        let that=this;
        let cardNum= wx.getStorageSync('cardNum')
        if(cardNum !=null){
          const  data = {
            cardNumber: cardNum
          };
          wx.showLoading({
            title: '努力加载中',
            mask: true
          });
          dev_request.Get('/v1/app/get-stu-info.gson', data, function (res) {
            console.log(res);
            wx.hideLoading();
            if(res.attribute.data!=null){
                that.setData({
                    realName:res.attribute.data.accountName,
                    sex:res.attribute.data.sex,
                    cardNum:res.attribute.data.cardNumber,
                    idCardPhoto:res.attribute.data.idCardPhoto,
                    headPhoto:res.attribute.data.headPhoto,
                    sexName:res.attribute.data.sexName,
                  });
            }

            
           
          }, function (err) {
            console.log(err);
            wx.hideLoading();
          });
        }
    },

    ChooseImage() {
      return;
      wx.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (res.tempFilePaths.length > 0) {
            this.setData({
              imgList: res.tempFilePaths
            })
            this.accountuploadfile(this.data.imgList[0]);
          }

         
          // if (this.data.imgList.length != 0) {
          //   this.setData({
          //     imgList: this.data.imgList.concat(res.tempFilePaths)
          //   })
          // } 
        }
      });
    },

    //上传头像
    accountuploadfile(tempFilePath){
      let that=this;
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      wx.uploadFile({
        url: app.globalData.TRAIN_URL+'/rest/account/upload-file.gson', //此处换上你的接口地址 
        filePath: tempFilePath,
        name: 'file',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'apiToken': 'Xl4KHyN2zesyVFpTguruyAvdT/3yDH5jL35QMHmXM0VKwa8tINBFRQRi7FV9JAgMMjEjP9/zlY2yk88DLsRAUQ=='
        },
        success: function (res) {
            console.log(res);
            wx.hideLoading();
            console.log("train_request---:"+JSON.stringify(res));
            let data = JSON.parse(res.data); // 这个很关键
            console.log(data);
          
            // wx.showToast({
            //   title: data.respDesc,
            //   icon: 'none',
            //   duration: 3500
            // })
            if(data.respCode==200){
                  console.log(data.attribute.data);
                  that.setData({
                    headPhoto: data.attribute.data
                  })
            }else{
              
            }
           
        },  
        fail: function (res) {  
          wx.hideLoading();
          //处理失败时的逻辑
          
        }  
      })
    },
    toSave(){
      if( this.data.headPhoto ==null||this.data.headPhoto==''  ){//&& (this.data.idCardPhoto ==null||this.data.idCardPhoto=='')

      }else{
        this.savepersonalinfo();
      }
     
    },


    //idcardFrontPath
    idcardChooseImage() {
      wx.showToast({
        title: '请联系管理员进行修改',
        icon: 'none',
        duration: 3500
      })
      return;

      // wx.chooseImage({
      //   count: 1, //默认9
      //   sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      //   sourceType: ['album'], //从相册选择
      //   success: (res) => {
      //     if (res.tempFilePaths.length > 0) {
      //       this.idcardaccountuploadfile(res.tempFilePaths[0]);
      //     }

      //   }
      // });
    },

    //上传身份证正面照
    idcardaccountuploadfile(tempFilePath){
      let that=this;
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      wx.uploadFile({
        url: app.globalData.TRAIN_URL+'/rest/account/upload-file.gson', //此处换上你的接口地址 
        filePath: tempFilePath,
        name: 'file',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'apiToken': 'Xl4KHyN2zesyVFpTguruyAvdT/3yDH5jL35QMHmXM0VKwa8tINBFRQRi7FV9JAgMMjEjP9/zlY2yk88DLsRAUQ=='
        },
        success: function (res) {
            console.log(res);
            wx.hideLoading();
            console.log("train_request---:"+JSON.stringify(res));
            let data = JSON.parse(res.data); // 这个很关键
            console.log(data);
          
            if(data.respCode==200){
                  console.log(data.attribute.data);
                  that.setData({
                    idCardPhoto: data.attribute.data
                  })
            }else{
              
            }
           
        },  
        fail: function (res) {  
          wx.hideLoading();
          //处理失败时的逻辑
          
        }  
      })
    },











    //保持个人资料
    savepersonalinfo(){
      let that=this;
      let imagePath=this.data.headPhoto;
      let accountId= wx.getStorageSync('studyAccountId');
      let  data  = {
        imagePath: imagePath,
        accountId: accountId
      };
      // if((this.data.headPhoto !=null||this.data.headPhoto!='') && (this.data.idCardPhoto ==null||this.data.idCardPhoto=='') ){
      //   data = {
      //     imagePath: imagePath,
      //     accountId: accountId
      //   };
      // }else if((this.data.headPhoto ==null||this.data.headPhoto=='') && (this.data.idCardPhoto !=null||this.data.idCardPhoto!='') ){
      //   data = {
      //     idcardFrontPath: that.data.idCardPhoto,
      //     accountId: accountId
      //   };
      // }else if((this.data.headPhoto !=null||this.data.headPhoto!='') && (this.data.idCardPhoto !=null||this.data.idCardPhoto!='') ){
      //   data = {
      //     imagePath: imagePath,
      //     idcardFrontPath: that.data.idCardPhoto,
      //     accountId: accountId
      //   };
      // }
      
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      train_request.Post('/rest/account/save-personal-info.gson', data, function (res) {
        console.log(res);
        wx.hideLoading();
         //保存头像到本地
         wx.setStorageSync('headPhoto', imagePath);

        setTimeout(function () {
          wx.showToast({
            title: res.respDesc,
            icon: 'none',
            duration: 3500
          })
        }, 100)
        wx.navigateBack({
          delta: 1
        })

        // if(res.attribute.data!=null){
        //   that.setData({
        //     orderdetail: res.attribute.data
        //   })
        // }
       
      }, function (err) {
        wx.hideLoading();
        console.log(err);
      });
    },
})