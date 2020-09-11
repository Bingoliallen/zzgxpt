const base_request = require('../../utils/base_request.js')
const app = getApp();

Page({
  data: {
    PageCur: 'home'
  },
    /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
      var _obj=options.PageCur;   
      console.log("PageCur----:"+_obj);
      this.setData({
        PageCur: _obj 
      });
     
  },

   /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.getconfig();
      this.getData();
      if(this.data.PageCur=='home'){
        this.selectComponent("#my-home").onRefresh();
      }else if(this.data.PageCur=='learn'){
        this.selectComponent("#my-learn").chechSMRZ();
      }else if(this.data.PageCur=='mine'){
        this.selectComponent("#my-mine").init();
      }
      this.getAutn();
      
      
  },

  getAutn(){
      // 获取用户授权设置，如果用户第一次进入未授权会出现弹窗
      let that=this;
      wx.getSetting({
        success: response => {
          if (!response.authSetting['scope.camera']) {
            wx.authorize({
              scope: 'scope.camera',
              success() {
                // 同意摄像头
              },
              fail() {
                // 不同意摄像头
                wx.showModal({
                  title: '提示',
                  content: '摄像头未授权将影响您的正常使用，请前往小程序设置页开启',
                  showCancel: false,
                  confirmText: '去设置',
                  success: function (res) {
                      if (res.confirm) {
                        that.onAuth();
                      } else if (res.cancel) {
                        
                      }
                  }
                })
               
              }
            })
          }
        },
        fail: res => {
        },
        complete: res => {
        },
      }) 
  },

  onAuth() {
    let that=this;
    wx.openSetting({
      success: (res) => {
      
      }
    })
  },

  onPullDownRefresh: function () {  //下拉刷新
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    if(this.data.PageCur=='home'){
      this.selectComponent("#my-home").onRefreshAll();
    }
    if(this.data.PageCur=='learn'){
      this.selectComponent("#my-learn").onRefresh();
    }
    if(this.data.PageCur=='mine'){
      wx.hideNavigationBarLoading(); //完成停止加载图标
      wx.stopPullDownRefresh();
    }
    
  },  

   /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if(this.data.PageCur=='learn'){
          this.selectComponent("#my-learn").getmore();
      }
   
    },

  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '郑州高训平台',
      imageUrl: '/images/ic_launcher.png',
      path: '/pages/index/index'
    }
  },

  getData(){
    let that=this;
    const  data = {
      
    };
    base_request.Get( app.globalData.TRAIN_URL+'/rest/login/get-config-bean.gson', data, function (res) {
      console.log("base_request---:"+JSON.stringify(res));
      if(res!=null){
        app.globalData.configBean=res;
        //console.log(app.globalData.configBean.classTypeName)
      }
    }, function (err) {
      console.log(err);
    });
  },

  getconfig(){
    let that=this;
    const  data = {
    };
    base_request.Get(app.globalData.DEV_URL+'/v1/app/get-config.gson', data, function (res) {
      console.log(res);
      if(res.attribute!=null){
        app.globalData.config=res.attribute;
        
        // show_train_complete: "1"
        // version: ""
      }
    }, function (err) {
      console.log(err);

    });
},

  //调用微信登录接口
  getOpenId(){
    wx.login({
      success: function (loginCode) {
        var appid = 'wxa0ccd6798c92cb7a'; //填写微信小程序appid
        var secret = ''; //填写微信小程序secret
  
        //调用request请求api转换登录凭证
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=‘+<code></code>appid+’&secret=‘+secret+’&grant_type=authorization_code&js_code='+loginCode.code,
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res.data.openid) //获取openid
          }
        })
      }
    })
  },
 

})