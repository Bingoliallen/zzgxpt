// pages/forgetpwd/forgetpwd.js
const dev_request = require('../../utils/dev_request.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBtnClick:false,
    userPhone:'',
    userCode:'',
    userPwd:'',
    userPwdTwo:'',
    setInter:'',//存储计时器
    num: 60,
    showDialogCode: true 
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
    this.endSetInter();
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

  phoneInput:function(e){
    this.setData({
      userPhone: e.detail.value
    })
  },

  codeInput:function(e){
    this.setData({
      userCode: e.detail.value
    })
  },

  pwdInput:function(e){
    this.setData({
      userPwd: e.detail.value
    })
  },

  pwdtwoInput:function(e){
    this.setData({
      userPwdTwo: e.detail.value
    })
  },


  toForm: function (e) {
    let phoneNum=this.data.userPhone;
    let ver = this.verPhone(phoneNum);
    if(ver==false){
      return;
    }
    let code=this.data.userCode;
    if(code == ""){
      wx.showToast({
        title: '请输入验证码',
         icon: 'none',
        duration: 3500
      })
      return;
    }
    let pwd=this.data.userPwd;
    if(pwd == "" ){
      wx.showToast({
        title: '请输入密码',
         icon: 'none',
        duration: 3500
      })
      return;
    }else if(pwd.length < 8){
      wx.showToast({
        title: '密码格式不正确',
         icon: 'none',
        duration: 3500
      })
      return;
    }else if(pwd.length > 18){
      wx.showToast({
        title: '密码格式不正确',
         icon: 'none',
        duration: 3500
      })
      return;
    }
    let pwdtwo=this.data.userPwdTwo;
    if(pwdtwo == "" ){
      wx.showToast({
        title: '请再次输入密码',
         icon: 'none',
        duration: 3500
      })
      return;
    }else if(pwdtwo.length < 8){
      wx.showToast({
        title: '确认密码格式不正确',
         icon: 'none',
        duration: 3500
      })
      return;
    }else if(pwdtwo.length > 18){
      wx.showToast({
        title: '确认密码格式不正确',
         icon: 'none',
        duration: 3500
      })
      return;
    }
    
    if(pwdtwo != pwd){
      wx.showToast({
        title: '两次密码输入不一致，请重新输入',
         icon: 'none',
        duration: 3500
      })
      return;
    }

    const  data = {
      password: pwd,
      mobile: phoneNum,
      mobileCode: code,
      // account: '1'
    };
    wx.showLoading({
      title: '努力加载中',
      mask: true
    });
    dev_request.Post('/v1/app/authentication.gson', data, function (res) {
      console.log(res);
      wx.hideLoading();
      
      setTimeout(function () {
        wx.showToast({
          title: res.respDesc,
          icon: 'none',
          duration: 3500
        })
      }, 100)
      wx.navigateBack({
        delta: 1  // 返回上一级页面
      })
    }, function (err) {
      console.log(err);
     wx.hideLoading();
    });

  },


  getCode(){
    if(this.data.isBtnClick==true){
      return;
    }else{
      this.setData({ 
        isBtnClick: true });
    }
    let that=this;
    let phoneNum=this.data.userPhone;
    let ver = this.verPhone(phoneNum);
    if(ver){
      const  data = {
        mobile: phoneNum
      };
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      dev_request.Post('/v1/app/check-and-send-mobile-code.gson', data, function (res) {
        console.log(res);
        wx.hideLoading();
        setTimeout(function () {
          wx.showToast({
            title: res.respDesc,
            icon: 'none',
            duration: 3500
          })
        }, 100)
        that.startSetInter();
      }, function (err) {
        console.log(err);
        wx.hideLoading();
        that.setData({ 
          isBtnClick: false});
      });
    }else{
      that.setData({ 
        isBtnClick: false});
    }
   
  },


  verPhone: function(e) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (e == '') {
      wx.showToast({
        title: '请输入手机号码',
         icon: 'none',
        duration: 3500
      })
      return false
   } else if (e.length != 11) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 3500
      })
     return false
    } else if (!myreg.test(e)) {
     wx.showToast({
       title: '请输入正确的手机号',
            icon: 'none',
             duration: 3500
          })
          return false
        }
      return true
   },


   
  startSetInter: function(){
    var that = this;
    that.setData({ 
      num: 60 ,
      showDialogCode: false });
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
        function () {
            var numVal = that.data.num - 1;
            that.setData({ num: numVal });
            if(that.data.num>0){
            
            }else{
              that.endSetInter();
           }
        }
  , 1000);   
},

endSetInter: function(){
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
    that.setData({ 
      num: 60,
      isBtnClick: false,
      showDialogCode: true });
},


})