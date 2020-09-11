// pages/course-learn/index.js
const dev_request = require('../../utils/dev_request.js')
const train_request = require('../../utils/train_request.js')
const app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        iconUrl: app.globalData.iconUrl,
        name:null,
        phone:null,
        planExamTime: null,
        gz: null,
        gzdj: null,
        bz: null,
        uncommittedList: null,
        uncommittedIndex: -1,
        showJYDialog:false,
    



        mst:null,
        mstCourse:null,
        configBean: app.globalData.configBean,
        config: app.globalData.config,

        indexId:0,
        myClassId:null,
        detaildata:{

        },
        pic:'/images/pic_bg@3x.png',


        newsList:[           
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var classId=options.classId;   
        var myClassId=options.myClassId;        
        this.setData({
            classId: classId,
            myClassId: myClassId
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
        this.getData();
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

    toStudy: function(e) {
        let classId=this.data.classId;
        let myClassId=this.data.myClassId;
        wx.navigateTo({
            url: "/pages/open-study/start-study/index?classId="+classId+"&myClassId=" + myClassId + "&index="+this.data.indexId
        })
     },

     goDetail: function(e) {
         let classId=this.data.classId;
         let myClassId=this.data.myClassId;
        wx.navigateTo({
            url: "/pages/open-study/start-study/index?classId="+classId+"&myClassId=" + myClassId + "&index=" + e.currentTarget.dataset.id
           
        })
    },
    goKefu: function(e) {
       wx.navigateTo({
           url: "/pages/mine/customer-service/index"
          
       })
   },

   handleContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
   },

     //获取我的课程信息（报名成功，点击进入详情之前，需调用并判断班级学习是否已过期）
     getData(){
        let that=this;
        let accountId= wx.getStorageSync('studyAccountId');
        const  data = {
            myClassId: that.data.myClassId,
            accountId: accountId
        };
        wx.showLoading({
            title: '努力加载中',
            mask: true
          });
        this.setData({
            config: app.globalData.config,
        });
        train_request.Get('/rest/class/my-class.gson', data, function (res) {
          console.log(res);
          wx.hideLoading();
          if(res.attribute.data!=null){
             that.setData({
              detaildata: res.attribute.data
             })
             if(that.data.detaildata.status>1){
                that.setData({
                    indexId: 0,
                    mst:null,
                    mstCourse: '课程已全部完成'
                })
             }else{
                if(that.data.detaildata.lastCourseId==null||that.data.detaildata.lastCourseId==''){
                    that.setData({
                        indexId: 0,
                        mst:'开始学习',
                        mstCourse: '您还未开始学习，点击开始学习吧！'
                    })
                 }else{
                     for(let i=0;i<that.data.detaildata.myClassCourseRPList.length;i++){
                         if(that.data.detaildata.myClassCourseRPList[i].myClassCourseId==that.data.detaildata.lastCourseId){
                            that.setData({
                                indexId: i,
                                mst:'继续学习',
                                mstCourse: '最近学习到：'+that.data.detaildata.myClassCourseRPList[i].courseName
                            })
                            break;
                         }
                     }
                 }
             }
             if(that.data.config.show_train_complete==1 && Math.floor(that.data.detaildata.studySpeed)==100){//&&that.data.detaildata.status==2 
                that.queryuncommittedclass();
             }
             
          }
         
        }, function (err) {
          console.log(err);
          wx.hideLoading();
        });
    },

  //获取是否有学习完的班级未提交结业申请
  queryuncommittedclass(){
    let that=this;
    let accountId= wx.getStorageSync('studyAccountId');
    let cardNum = wx.getStorageSync('cardNum');
    let mobile = wx.getStorageSync('mobile');
    let realName = wx.getStorageSync('realName');
    const  chdata = {
      accountId: accountId
    };
    this.setData({
      configBean: app.globalData.configBean,
    });
    dev_request.Get('/v1/app/query-uncommitted-class.gson', chdata, function (res) {
      console.log(res);
      if(res.attribute.data!=null && res.attribute.data.length>0){
          that.setData({
             uncommittedList:  res.attribute.data
          })
         for(let i=0;i<res.attribute.data.length;i++){
          if( res.attribute.data[i].classId != that.data.configBean.generalCoursesClassId &&
                  res.attribute.data[i].classId==that.data.detaildata.classId){
            that.setData({
              uncommittedIndex:  i
            })
           
            let className=res.attribute.data[i].className ;
            let classId=res.attribute.data[i].classId ;
            that.setData({
              jyclassId:      classId,
              gz:      className,
              cardNum:  cardNum,
              phone:  mobile,
              name:  realName,
              showJYDialog:  true,
            })
            
            break;
          }
         }
        
        
      }
      
     
    }, function (err) {
      console.log(err);
     
    });
  },
   
  //结业申请--填写
  savezhengzhoumessage(){
    let that=this;
    if(that.data.name ==null || that.data.name ==''){
      wx.showToast({
        title: '请输入姓名',
         icon: 'none',
        duration: 3500
      })
      return;
    }

    if(that.data.phone ==null || that.data.phone ==''){
      wx.showToast({
        title: '请输入联系电话',
         icon: 'none',
        duration: 3500
      })
      return;
    }

    if(that.data.gz ==null || that.data.gz ==''){
      wx.showToast({
        title: '请输入学习及考试工种',
         icon: 'none',
        duration: 3500
      })
      return;
    }


    if(that.data.gzdj ==null || that.data.gzdj ==''){
      wx.showToast({
        title: '请输入学习及考试工种等级',
         icon: 'none',
        duration: 3500
      })
      return;
    }
    if(that.data.planExamTime ==null || that.data.planExamTime ==''){
      wx.showToast({
        title: '请选择预计参加考试时间',
         icon: 'none',
        duration: 3500
      })
      return;
    }


    const  chdata = {
      classId:  that.data.jyclassId,
      accountName: that.data.name,
      cardNumber: that.data.cardNum,
      mobile: that.data.phone,
      profession: that.data.gz,
      professionLevel: that.data.gzdj,
      planExamTime: that.data.planExamTime,
      remark: that.data.bz,
    };
    wx.showLoading({
      title: '努力加载中',
      mask: true
    });
    train_request.Post('/class/save-zheng-zhou-message.gson', chdata, function (res) {
      console.log(res);
      wx.hideLoading();
      setTimeout(function () {
        wx.showToast({
          title: res.respDesc,
           icon: 'none',
          duration: 3500
        })
      }, 100)
      if(res.attribute!=null){
      }
      that.setData({
        jyclassId: null,
        name: null,
        phone:  null,
        gz: null,
        gzdj: null,
        bz: null,
        uncommittedList: null,
        uncommittedIndex:  -1,
        showJYDialog:  false,
      })
      //that.queryuncommittedclass();
     
    }, function (err) {
      console.log(err);
      wx.hideLoading();
    });
  },
   
  radioChange:function(e) {
       console.log('点击的是第'+e.detail.value+'个radio')
       this.setData({
            planExamTime: e.detail.value
       })   
    
  },

  nameInput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },

  gzInput:function(e){
    this.setData({
      gz: e.detail.value
    })
  },

  gzdjInput:function(e){
    this.setData({
      gzdj: e.detail.value
    })
  },
  bzInput:function(e){
    this.setData({
      bz: e.detail.value
    })
  },

})