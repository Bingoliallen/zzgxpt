// pages/mine/my-order/order-detail/index.js
const dev_request = require('../../../../utils/dev_request.js')
const train_request = require('../../../../utils/train_request.js')
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheckFace:1,
    imgUrl: app.globalData.imgUrl,
    orderdetail:null,
    orderId:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _obj=options.id;        
    this.setData({
      orderId: _obj
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
       this.myorderdetail();
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

  goDetail(){
    let that=this;
    let orderdetail=this.data.orderdetail;
    
    if(that.data.isOver==1){
      wx.showToast({
        title: '课程已过期',
         icon: 'none',
        duration: 3500
      })
      return;
    }
    if(that.data.isCheckFace==1){
      wx.setStorageSync('isRenLianCheckSuss', null);
      wx.navigateTo({
        url: "/pages/open-study/authentication/index?isRenLianCheck=false&classId=" + that.data.classId
        +"&myClassId=" + that.data.myClassId
      })
    }else{
      wx.navigateTo({
         url: "/pages/course-learn/index?classId="+ that.data.classId +"&myClassId=" + that.data.myClassId
        // url: "/pages/open-study/start-study/index?classId="+that.data.classId+"&myClassId=" + that.data.myClassId + "&index=0"
    })
    }
    
  },
  
  //订单详情
  myorderdetail(){
      let that=this;
      let orderId=this.data.orderId;
      let accountId= wx.getStorageSync('studyAccountId');
      const  data = {
        orderId: orderId,
        accountId: accountId
      };
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      train_request.Get('/rest/cms/order/my-order-detail.gson', data, function (res) {
        console.log(res);
        wx.hideLoading();
        if(res.attribute.data!=null){
          that.setData({
            orderdetail: res.attribute.data,
            classId: res.attribute.data.orderItemList[0].obj.classId
          })
          that.classstatus(that.data.classId);
          that.getclassdetail(that.data.classId);
          
        }
       
      }, function (err) {
        wx.hideLoading();
        console.log(err);
      });
    },

    
    classstatus(classId){
      let that=this;
      let accountId= wx.getStorageSync('studyAccountId');
      const  data = {
        classId: classId,
        accountId: accountId
      };
     
      train_request.Get('/rest/class/class-status.gson', data, function (res) {
        console.log(res);
        if(res.attribute.data!=null){
          that.setData({
            myClassId: res.attribute.data
          })
          that.getDataToJY(that.data.myClassId);
        }
       
      }, function (err) {
        console.log(err);
      });
    },

    getDataToJY(myClassId){
      let that=this;
      let accountId= wx.getStorageSync('studyAccountId');
      const  data = {
          myClassId: myClassId,
          accountId: accountId
      };
      train_request.Get('/rest/class/my-class.gson', data, function (res) {
        console.log(res);
        if(res.attribute.data!=null){
          that.setData({
            isCheckFace: res.attribute.data.isCheckFace
          })
        }
      }, function (err) {
        console.log(err);
      });
     },

//课程详情（未报名）
getclassdetail(classId){
  let that=this;
  let accountId= wx.getStorageSync('accountId');
  const  data = {
    classId: classId,
  //   accountId: accountId
  };
  train_request.Get('/rest/class/get-class-detail.gson', data, function (res) {
    console.log(res);
    if(res.attribute.data!=null){
      that.setData({
        isOver: res.attribute.data.isOver
      })
    }
   
  }, function (err) {
    console.log(err);
  });
},


})