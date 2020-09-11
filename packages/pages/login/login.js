// pages/login/login.js
const dev_request = require('../../../utils/dev_request.js')
const train_request = require('../../../utils/train_request.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:null,
    showDialog:false,
    userNum:'',
    userPwd:'',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    isLogin: false, // 默认没有
    isChange: false, // 默认没有
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
     let userNum=  wx.getStorageSync('mobileRegister');
     let userPwd= wx.getStorageSync('pwdRegister');
    this.setData({
      userNum:'',
      userPwd:'',
    })
    let smrzLearn= wx.getStorageSync('smrzLearn');
    if(smrzLearn==true && this.data.result!=null){//登录后去实名认证成功

      wx.setStorageSync('mobileRegister', null);
      wx.setStorageSync('pwdRegister', null);
      wx.redirectTo({
        url: '/pages/index/index?PageCur=learn',
      });
       // this.goHome(this.data.result);
    }else if(smrzLearn==true && userNum!=null && userPwd!=null){//注册后去实名认证成功
      wx.setStorageSync('mobileRegister', null);
      wx.setStorageSync('pwdRegister', null);
      wx.redirectTo({
        url: '/pages/index/index?PageCur=learn',
      });
      // this.toLoginRef(userNum,userPwd);
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

  },

  toLogin() {
    let that=this;
   // var bol = this.data.isLogin; // 获取状态
    
    if(this.data.userNum == ""){
      wx.showToast({
        title: '请输入账号',
         icon: 'none',
        duration: 3500
      })
      return;
    }
    if(this.data.userPwd == ""){
      wx.showToast({
        title: '请输入密码',
         icon: 'none',
        duration: 3500
      })
      return;
    }

    this.setData({
      isLogin: true // 改变状态

    })
    const  data = {
      cardNumOrMobile: this.data.userNum,//this.data.userNum
      passWord: this.data.userPwd,//this.data.userPwd
      roleType: '0'
    };
    // wx.showLoading({
    //   title: '努力加载中',
    //   mask: true
    // });
    dev_request.Post('/v1/app/login.gson', data, function (res) {
      console.log(res);
     // wx.hideLoading();
      wx.setStorageSync('mobileRegister', that.data.userNum);
      wx.setStorageSync('pwdRegister', that.data.userPwd);

      wx.setStorageSync('accountIdRegister', res.attribute.data.accountId);
      wx.setStorageSync('cardNum', res.attribute.data.cardNum);
      that.checkcomplete(that.data.userNum,res);
      
    }, function (err) {
      console.log(err);
      //wx.hideLoading();
     
    });
    setTimeout(function () {
      that.setData({
        isLogin: false // 改变状态
  
      })
    }, 300)    
    
  },

  toForget() {
    wx.navigateTo({
      url: '/pages/forgetpwd/forgetpwd',
    });
  },
  toRegister() {
    wx.navigateTo({
      url: '/pages/register/index',
    });
  },

  numInput:function(e){
    this.setData({
      userNum: e.detail.value
    })
  },

  pwdInput:function(e){
    this.setData({
      userPwd: e.detail.value
    })
  },
   
  //校验是否完善信息
  checkcomplete(mobile,result){
    let that=this;
    const  chdata = {
      number: mobile
    };
    dev_request.Get('/v1/app/check-complete.gson', chdata, function (res) {
      console.log(res);
      if(res.attribute!=null){
         //state 1：实名认证页 state 2：正常登录页 state 0：完善头像信息页
          if(res.attribute.state==1){
            that.setData({
              result: result
            })
            wx.setStorageSync('smrzLearn', false);
            that.showModal();
          }else {
            wx.showToast({
              title: result.respDesc,
              icon: 'none',
              duration: 3500
            })
            that.goHome(result);
          }
      }else {
        wx.showToast({
          title: result.respDesc,
          icon: 'none',
          duration: 3500
        })
        that.goHome(result);
      }
     
    }, function (err) {
      console.log(err);
      wx.showToast({
        title: result.respDesc,
        icon: 'none',
        duration: 3500
      })
      that.goHome(result);
      
    });
     
  },

  goHome(res){

    wx.setStorageSync('smrzLearn', true);
    wx.setStorageSync('accountId', res.attribute.data.accountId);
    wx.setStorageSync('unitName', res.attribute.data.unitName);
    wx.setStorageSync('cardNum', res.attribute.data.cardNum);
    wx.setStorageSync('mobile', res.attribute.data.mobile);
    wx.setStorageSync('realName', res.attribute.data.realName);
    wx.setStorageSync('isOneLogin', res.attribute.data.isOneLogin);
    wx.setStorageSync('cardType', res.attribute.data.cardType);

    wx.setStorageSync('accountType', res.attribute.data.accountType);
    wx.setStorageSync('idCardPhoto', res.attribute.data.idCardPhoto);
    wx.setStorageSync('firstCheckPhoto', res.attribute.data.firstCheckPhoto);
    wx.setStorageSync('studyAccountId', res.attribute.data.studyAccountId);

    wx.setStorageSync('sex', res.attribute.data.sex);
    wx.setStorageSync('dbNumber', res.attribute.data.dbNumber);
    
    
    wx.setStorageSync('mobileRegister', null);
    wx.setStorageSync('pwdRegister', null);

    wx.redirectTo({
      url: '/pages/index/index?PageCur=learn',
    });
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
    //去实名认证
    wx.navigateTo({
      url: "/pages/certification/index?isRegister=true"
    })
  },

  toLoginRef(userNum,userPwd) {
    let that=this;
    const  data = {
      cardNumOrMobile: userNum,
      passWord: userPwd,
      roleType: '0'
    };
    dev_request.Post('/v1/app/login.gson', data, function (res) {
      console.log(res);
      wx.setStorageSync('accountIdRegister', res.attribute.data.accountId);
      wx.setStorageSync('cardNum', res.attribute.data.cardNum);
    
      // wx.showToast({
      //   title: res.respDesc,
      //   icon: 'none',
      //   duration: 3500
      // })
      that.goHome(res);
    }, function (err) {
      console.log(err);
    });
  
  },

})