// pages/mine/mine.js
const dev_request = require('../../utils/dev_request.js')
const train_request = require('../../utils/train_request.js')
const app = getApp();


Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    headPhoto:null,
    imgUrl: app.globalData.imgUrl,
    realName:'',
    cardNum:'',
    isLogin:false,
    goods: [
      {"courseName":"我的档案","courseImg":"/images/js_images_practice_pro.png","courseHour":11.0,"courseLessons":4},
      {"courseName":"我的订单","courseImg":"/images/js_images_archives_pro.png","courseHour":4.5,"courseLessons":4},
      {"courseName":"个人设置","courseImg":"/images/js_images_install_pro.png","courseHour":8.0,"courseLessons":6},
      {"courseName":"在线客服","courseImg":"/images/js_images_service_pro.png","courseHour":10.0,"courseLessons":4}

    ],
  },

  
  attached() {
      this.init();
  },

  methods: {
    init(){
      let  accountId= wx.getStorageSync('accountId');
      console.log("accountId----:"+accountId); 
      if(accountId== null || accountId==''){
        this.setData({
          isLogin: false 
        })
      }else {
        this.setData({
          isLogin: true 
        })
      }
  
  
      let  realName= wx.getStorageSync('realName');
     // let  cardNum= wx.getStorageSync('cardNum');
      this.setData({
        realName: realName 
      })
      // this.setData({
      //   cardNum: cardNum 
      // })
      if(this.data.isLogin==true){
          this.getstuinfo();
      }
    },
    //获取个人信息
    getstuinfo(){
      let that=this;
      let cardNum= wx.getStorageSync('cardNum')
      if(cardNum !=null){
        const  data = {
          cardNumber: cardNum
        };
        
        dev_request.Get('/v1/app/get-stu-info.gson', data, function (res) {
          console.log(res);
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
        });
      }
    },
    goDetail: function(e) {
      if(this.data.isLogin){
        wx.navigateTo({
          url: "/pages/mine/user-info/index?"
        })
      }else{
        wx.navigateTo({
          url: "/packages/pages/login/index?type=learn"
        })
      }
     
    },
    toDetailsTap: function(e) {
      if(this.data.isLogin==false){
        wx.navigateTo({
          url: "/packages/pages/login/index?type=learn"
        })
        return;
      }
      let id= e.currentTarget.dataset.id;
      if(id==0){
        wx.navigateTo({
          url: "/pages/mine/my-record/index" 
        })
      }else if(id==1){
        wx.navigateTo({
          url: "/pages/mine/my-order/index" 
        })
      }else if(id==2){
        wx.navigateTo({
          url: "/pages/mine/setting/index" 
        })
      }else if(id==3){
        // wx.navigateTo({
        //   url: "/pages/mine/customer-service/index" 
        // })
      }
     
     },
     handleContact (e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
    },
  },

})