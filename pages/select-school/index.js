// pages/select-school/index.js
const dev_request = require('../../utils/dev_request.js')
const train_request = require('../../utils/train_request.js')
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog:false,

    unitId:'',
    unitName:'',
    address:'',
    indexsel:-1,
    gridCol:2,
    gridBorder:true,
    classId:'',
    className:'',

    list: [
    ],

    pageTotal:0,
    pageNo:1,
    pageSize:10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        var classId=options.id;  
        var className=options.className;  
        
        console.log("classId---ss----:"+classId);
        this.setData({
             className: className,
             classId: classId 
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
    this.setData({
      pageNo: 1,
      pageTotal: 0,
    })
    this.getData();
    this.getmyclasslist();
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    this.setData({
      pageNo: 1,
      pageTotal: 0,
    })
    this.getData();
    this.getmyclasslist();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.pageTotal<=this.data.pageNo){
      wx.showToast({
        title: '没有更多了',
         icon: 'none',
        duration: 1000
      })
       return;
    }
    let pageNo=this.data.pageNo+1;
    this.setData({
      pageNo: pageNo
    })
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getData(){
    let that=this;
    let cardNumber= wx.getStorageSync('cardNum');
    const  data = {
      cardNumber: cardNumber,
      classId: that.data.classId,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize
    };
    wx.showLoading({
      title: '努力加载中',
      mask: true
    });
    dev_request.Post('/v1/app/class/query-school-list.gson', data, function (res) {
      console.log(res);
      wx.hideLoading();
      if(res.attribute.data!=null){
          that.setData({
            pageTotal: res.attribute.data.pageTotal,
          })
          if(that.data.pageNo==1){
            that.setData({
              list: res.attribute.data.list
             })
          }else{
            that.setData({
              list: that.data.list.concat(res.attribute.data.list)
             })
          }
      }
      wx.hideNavigationBarLoading(); //完成停止加载图标
      wx.stopPullDownRefresh();
    }, function (err) {
      console.log(err);
      wx.hideLoading();
      wx.hideNavigationBarLoading(); //完成停止加载图标
      wx.stopPullDownRefresh();
    });
  },

  getmyclasslist(){
    let that=this;
    let cardNumber= wx.getStorageSync('cardNum');
    const  data = {
      cardNum: cardNumber
    };
    dev_request.Get('/v1/app/find-my-class-list.gson', data, function (res) {
      console.log(res);
      if(res.attribute!=null){
         that.setData({
          applyTotal: res.attribute.applyTotal,
          myclasslist: res.attribute.list
         })
      }
    }, function (err) {
      console.log(err);
    });
  },

  toSchoolList(e){
    var that = this;
    that.setData({
      indexsel: e.currentTarget.dataset.index,
      unitName: e.currentTarget.dataset.item.unitName,
      address: e.currentTarget.dataset.item.address,
      unitId: e.currentTarget.dataset.id
    })
    that.showModal();
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
  hideModalBM(e) {
    this.setData({
        showDialog: false
    })
    this.toappapply();
  },

   /**
    * 报名
    */
  toappapply(){
    let that=this;
    let cardNumber= wx.getStorageSync('cardNum');
    const  data = {
      cardNum: cardNumber,
      classId: that.data.classId,
      unitId: that.data.unitId
    };
    wx.showLoading({
      title: '努力加载中',
      mask: true
    });
    dev_request.Post('/v1/app/apply.gson', data, function (res) {
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
        delta: 1
      })
    }, function (err) {
      console.log(err);
     wx.hideLoading();
    });
  },

})