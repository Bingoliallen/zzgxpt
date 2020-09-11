// pages/register/index.js
const dev_request = require('../../utils/dev_request.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {

    isBtnClick:false,
    setInter:'',//存储计时器
    select_read:false,
    userPhone:'',
    userCode:'',
    userPwd:'',
    userPwdTwo:'',
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
  
  

  loginBtnClick: function (e) {
    let that=this;
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
    if(this.data.select_read==false){
      wx.showToast({
        title: '请先阅读并同意协议',
         icon: 'none',
        duration: 3500
      })
      return;
    }

    const  data = {
      password: pwd,
      mobile: phoneNum,
      code: code,
      vcode: '1'
    };
    wx.showLoading({
      title: '努力加载中',
      mask: true
    });
    dev_request.Post('/v1/app/register.gson', data, function (res) {
      console.log(res);
      wx.hideLoading();
     
      setTimeout(function () {
        wx.showToast({
          title: res.respDesc,
          icon: 'none',
          duration: 3500
        })
      }, 100)
      if(res.attribute.data!=null){
        wx.setStorageSync('accountIdRegister', res.attribute.data);
        that.checkcomplete(phoneNum,pwd);
      }else{
        wx.navigateBack({
          delta: 1
        })
      }
      
     
    }, function (err) {
      console.log(err);
     wx.hideLoading();
    });

  },

    //校验是否完善信息
    checkcomplete(mobile,pwd){
      let that=this;
      const  chdata = {
        number: mobile
      };
      dev_request.Get('/v1/app/check-complete.gson', chdata, function (res) {
        console.log(res);
        if(res.attribute!=null){
           //state 1：实名认证页 state 2：正常登录页 state 0：完善头像信息页
            if(res.attribute.state==1){
              wx.setStorageSync('smrzLearn', false);
              wx.setStorageSync('mobileRegister', mobile);
              wx.setStorageSync('pwdRegister', pwd);
              that.showModal();
            }else {
              wx.navigateBack({
                delta: 1
              })
            }
        }else {
          wx.navigateBack({
            delta: 1
          })
        }
       
      }, function (err) {
        console.log(err);
        wx.navigateBack({
          delta: 1
        })
      });
       
    },



   //校验手机号是否存在
   checkmobileexist(){
   
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
      dev_request.Post('/v1/app/check-mobile-exist.gson', data, function (res) {
        console.log(res);
        that.getCode();
      }, function (err) {
        console.log(err);
        that.setData({ 
          isBtnClick: false});
      });
    }else{
      that.setData({ 
        isBtnClick: false});
    }
   
  },


  getCode(){
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
      dev_request.Post('/v1/app/send-mobile-code.gson', data, function (res) {
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
    
   selectRead: function (e) {
    var that = this;
    that.setData({
      select_read: (!that.data.select_read)
    })
  },


  goYhxy(){
    wx.navigateTo({
        url: '/pages/webview/index?title='+'用户注册协议'+'&newsUrl='+'https://wx-image.ghlearning.com/html/Registration_agreement.html',
      });
  },

  goYstk(){
    wx.navigateTo({
        url: '/pages/webview/index?title=隐私政策&&newsUrl=https://wx-image.ghlearning.com/html/Privacy_policy.html',
      });
  },
  goRlcj(){
    wx.navigateTo({
        url: '/pages/webview/index?title=人脸采集与识别服务协议&&newsUrl=https://wx-image.ghlearning.com/html/Face_protocol.htm',
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
    wx.redirectTo({
      url: "/pages/certification/index?isRegister=true"
    })
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