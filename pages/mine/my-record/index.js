// pages/mine/my-record/index.js
const dev_request = require('../../../utils/dev_request.js')
const train_request = require('../../../utils/train_request.js')
const app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
      totalPage: 0,
      pageNo: 1,
      PageSize: 10,

      totalPage2: 0,
      currentPage: 1,
      PageSize2: 50,

      imgUrl: app.globalData.imgUrl,

      learnYearDetail:{
        "learnElectiveHour": 0,
        "learnRequiredHour": 0
      },
      myrecordlist:[],
      index: null,//人员类别的
      learnYear: null,

      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var timestamp = Date.parse(new Date());
      var date = new Date(timestamp);
      //获取年份  
      var Y =date.getFullYear();
      this.setData({
        learnYear: ''+Y
      })
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
        totalPage: 0,
      })
      this.getaccountclasshourbyyear();
      this.findmyrecordlist(this.data.currentPage);
      this.learninglist(this.data.pageNo);
       
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
        totalPage: 0,
      })
      this.learninglist(this.data.pageNo);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if(this.data.totalPage<=this.data.pageNo){
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
      this.learninglist(this.data.pageNo);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    PickerChange(e) {
      console.log(e);
      this.setData({
        index: e.detail.value
      })
      console.log('--年度选择-PickerChange--：', this.data.myrecordlist[e.detail.value])
      this.setData({
        learnYear: this.data.myrecordlist[this.data.index].learnYear,
        learnYearDetail: this.data.myrecordlist[this.data.index]
      })
      //刷新数据
      this.setData({
        pageNo: 1,
        totalPage: 0,
      })
      this.learninglist(this.data.pageNo);
    },

    //我的档案（所有年度相关的信息）
    findmyrecordlist(topageNo){
      let that=this;
      let accountId= wx.getStorageSync('studyAccountId');
      const  data = {
        pageNo: topageNo,
        PageSize: that.data.PageSize2,
        accountId: accountId,
      };
      
      train_request.Get('/rest/cms/record/find-my-record-list.gson', data, function (res) {
        console.log(res);
        
        if(res.attribute.data!=null){
          
          that.setData({
            totalPage2: res.attribute.data.totalPage
          })
           that.setData({
            myrecordlist: res.attribute.data.list
           })
           if(that.data.myrecordlist!=null){
            for(let i=0;i<that.data.myrecordlist.length;i++){
               if(that.data.myrecordlist[i].learnYear == that.data.learnYear){
                that.setData({
                  learnYearDetail: that.data.myrecordlist[i]
                })
                console.log('--年度详情---：', that.data.learnYearDetail)
                break;
               }
            }
           }
          
        }
       
      }, function (err) {
       
        console.log(err);
      });
    },

    //获取年度通过班级总学时
    getaccountclasshourbyyear(){
      let that=this;
      let accountId= wx.getStorageSync('studyAccountId');
      const  data = {
        year: '2020',
        accoutId: accountId,
      };
      
      train_request.Get('/rest/class/get-account-class-hour-by-year.gson', data, function (res) {
        console.log(res);
       
        if(res.attribute!=null){
          that.setData({
            attribute: res.attribute
          })
        }
       
      }, function (err) {
      
        console.log(err);
      });
    },

    //我的档案课程列表
    learninglist(topageNo){
      let that=this;
      let accountId= wx.getStorageSync('studyAccountId');
      const  data = {
        year: that.data.learnYear,
        accountId: accountId,
        pageNo: topageNo,
        PageSize: that.data.PageSize,
        orderBy:4

      };
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      train_request.Get('/rest/cms/study/learning-list.gson', data, function (res) {
        console.log(res);
        wx.hideLoading();
        if(res.attribute.data!=null){
          
          that.setData({
            totalPage: res.attribute.data.totalPage
          })
          if(topageNo==1){
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
        wx.hideLoading();
        console.log(err);
        wx.hideNavigationBarLoading(); //完成停止加载图标
        wx.stopPullDownRefresh();
      });
    },


    goDetail: function(e) {
       let myClassId = e.currentTarget.dataset.item.myClassId; 
       let classId = e.currentTarget.dataset.id;
      //  this.getDataToJY(myClassId,e);
       this.getclassdetail(classId,e);
       
    },
   
    getDataToJY(myClassId,e){
      let that=this;
      let accountId= wx.getStorageSync('studyAccountId');
      const  data = {
          myClassId: myClassId,
          accountId: accountId
      };
      train_request.Get('/rest/class/my-class.gson', data, function (res) {
        console.log(res);
        if(res.attribute.data!=null){
            if(res.attribute.data.isOver==1){
              wx.showToast({
                title: '课程已过期',
                 icon: 'none',
                duration: 3500
              })
            }else{
              that.toGoLearn(e);
            }
        }else{
          that.toGoLearn(e);
        }
      }, function (err) {
        console.log(err);
        that.toGoLearn(e);
      });
     },

     toGoLearn(e){
      if(e.currentTarget.dataset.item.classEntity.isCheckFace==1){
        wx.navigateTo({
          url: "/pages/open-study/authentication/index?isRenLianCheck=false&classId=" + e.currentTarget.dataset.id
          +"&myClassId=" +  e.currentTarget.dataset.item.myClassId 
        })
      }else{
        wx.navigateTo({
          url: "/pages/course-learn/index?classId="+e.currentTarget.dataset.id
                 +"&myClassId=" + e.currentTarget.dataset.item.myClassId
        })
      }
     },
      //课程详情（未报名）
     getclassdetail(classId,e){
      let that=this;
      let accountId= wx.getStorageSync('accountId');
      const  data = {
        classId: classId,
      //   accountId: accountId
      };
      train_request.Get('/rest/class/get-class-detail.gson', data, function (res) {
        console.log(res);
        if(res.attribute.data!=null){
          if(res.attribute.data.isOver==1){
            wx.showToast({
              title: '课程已过期',
               icon: 'none',
              duration: 3500
            })
          }else{
            that.toGoLearn(e);
          }
      }else{
        that.toGoLearn(e);
      }
       
      }, function (err) {
        console.log(err);
        that.toGoLearn(e);
      });
    },

})