// pages/learn/learn.js
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
    configBean: app.globalData.configBean,
    classId: null,
    className: '',
    name:null,
    phone:null,
    planExamTime: null,
    gz: null,
    gzdj: null,
    bz: null,
    showCXDialog:false,
    showJYDialog:false,
    showJYTSDialog:false,

    showDialog:false,
    pageTotal:1,
    pageSize:10,
    pageNo:1,
    isLogin:false,
    url:'/images/js_images_banner_1.png',
    newsList:null,
    newsList1:[],
    eCancleClass:null,

  },
  attached() {
    let that=this;
    let  accountId= wx.getStorageSync('accountId');
    if(accountId== null || accountId==''){
      this.setData({
        isLogin: false 
      })
    }else {
      this.setData({
        isLogin: true 
      })
    }
    if(this.data.isLogin){
      let num= wx.getStorageSync('cardNum')
      const  data = {
        cardNumber: num,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      };
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      dev_request.Post('/v1/app/class/query-selected-class-list.gson', data, function (res) {
        console.log(res);
        wx.hideLoading();
        that.setData({
          pageTotal:  res.attribute.pageTotal 
        })
        if(res.attribute.list !=null){
          that.setData({
            newsList:  res.attribute.list 
          })
        }else{
          that.setData({
            newsList:  that.data.newsList1 
          })
        }
        
      }, function (err) {
        console.log(err);
        wx.hideLoading();
      });

      //校验是否完善信息
      let cardNum= wx.getStorageSync('cardNum')
      let mobile= wx.getStorageSync('mobile')
      let number=cardNum;
      if(cardNum == null || cardNum == ''){
        number=mobile;
      }
      const  chdata = {
        number: number
      };
     
      dev_request.Get('/v1/app/check-complete.gson', chdata, function (res) {
        console.log(res);
        if(res.attribute!=null){
           //state 1：实名认证页 state 2：正常登录页 state 0：完善头像信息页
            if(res.attribute.state==2){
              //that.showModal();
            }else if(res.attribute.state==1){
              that.showModal();
            }
        }
       
      }, function (err) {
        console.log(err);
        
      });
      that.getaccountinfo();
      that.queryuncommittedclass();

    }
    
    

  },
  methods: {
    chechSMRZ(){
      let that=this;
      let  accountId= wx.getStorageSync('accountId');
      if(accountId== null || accountId==''){
        that.setData({
          isLogin: false 
        })
      }else {
        that.setData({
          isLogin: true 
        })
      }
      if(that.data.isLogin){
        let  smrzLearn= wx.getStorageSync('smrzLearn');
        if(smrzLearn==false){
            //没有实名认证成功，直接到登录页面
            wx.clearStorage();
            wx.setStorageSync('mobileRegister', null);
            wx.setStorageSync('pwdRegister', null);
            that.toLogin();
        }else{
          that.onRefresh();
        }
      }
    },
    onRefresh(){
      let that=this;
      let  accountId= wx.getStorageSync('accountId');
      if(accountId== null || accountId==''){
        this.setData({
          isLogin: false 
        })
      }else {
        this.setData({
          isLogin: true 
        })
      }
      this.setData({
        pageNo: 1,
        pageSize: 10,
        pageTotal:1 
      })

      if(this.data.isLogin){
        let num= wx.getStorageSync('cardNum')
        const  data = {
          cardNumber: num,
          pageNo: this.data.pageNo,
          pageSize: this.data.pageSize
        };
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });
        dev_request.Post('/v1/app/class/query-selected-class-list.gson', data, function (res) {
          console.log(res);
          wx.hideLoading();
          that.setData({
            pageTotal:  res.attribute.pageTotal 
          })
          if(res.attribute.list !=null){
            that.setData({
              newsList:  res.attribute.list 
            })
          }else{
            that.setData({
              newsList:  that.data.newsList1 
            })
          }
         
          wx.hideNavigationBarLoading(); //完成停止加载图标
          wx.stopPullDownRefresh();
        }, function (err) {
          console.log(err);
          wx.hideLoading();
          wx.hideNavigationBarLoading(); //完成停止加载图标
          wx.stopPullDownRefresh();
        });
  
        //校验是否完善信息
        let cardNum= wx.getStorageSync('cardNum')
        let mobile= wx.getStorageSync('mobile')
        let number=cardNum;
        if(cardNum == null || cardNum == ''){
          number=mobile;
        }
        const  chdata = {
          number: number
        };
       
        dev_request.Get('/v1/app/check-complete.gson', chdata, function (res) {
          console.log(res);
          if(res.attribute!=null){
             //state 1：实名认证页 state 2：正常登录页 state 0：完善头像信息页
              if(res.attribute.state==2){
                //that.showModal();
              }else if(res.attribute.state==1){
                that.showModal();
              }
          }
         
        }, function (err) {
          console.log(err);
          
        });
        that.getaccountinfo();
        that.queryuncommittedclass();
      }
    },
    getmore(){
      let that=this;
      if(that.data.pageTotal<=that.data.pageNo){
        wx.showToast({
          title: '没有更多了',
           icon: 'none',
          duration: 1000
        })
         return;
      }
      let pageNo=that.data.pageNo+1;
      this.setData({
        pageNo: pageNo
      })

      if(this.data.isLogin){
        let num= wx.getStorageSync('cardNum')
        const  data = {
          cardNumber: num,
          pageNo: this.data.pageNo,
          pageSize: this.data.pageSize
        };
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });
        dev_request.Post('/v1/app/class/query-selected-class-list.gson', data, function (res) {
          console.log(res);
          wx.hideLoading();
          that.setData({
            pageTotal:  res.attribute.pageTotal 
          })
          if(res.attribute.list !=null){
            that.setData({
              newsList:  that.data.newsList.concat(res.attribute.list) 
            })
          }
          
         
        }, function (err) {
          console.log(err);
          wx.hideLoading();
        });
  
        //校验是否完善信息
        let cardNum= wx.getStorageSync('cardNum')
        let mobile= wx.getStorageSync('mobile')
        let number=cardNum;
        if(cardNum == null || cardNum == ''){
          number=mobile;
        }
        const  chdata = {
          number: number
        };
       
        dev_request.Get('/v1/app/check-complete.gson', chdata, function (res) {
          console.log(res);
          if(res.attribute!=null){
             //state 1：实名认证页 state 2：正常登录页 state 0：完善头像信息页
              if(res.attribute.state==2){
                //that.showModal();
              }else if(res.attribute.state==1){
                that.showModal();
              }
          }
         
        }, function (err) {
          console.log(err);
         
        });
        that.getaccountinfo();
        that.queryuncommittedclass();
  
      }
    },
    goDetail: function(e) {
      // wx.navigateTo({
      //   url: "/pages/open-study/tips/index?id=" + e.currentTarget.dataset.id
      // })
      if(e.currentTarget.dataset.item.isOver==1){
        wx.showToast({
          title: '课程已过期',
           icon: 'none',
          duration: 3500
        })
        return;
      }
      if(e.currentTarget.dataset.item.isCheckFace==1){
        wx.setStorageSync('isRenLianCheckSuss', null);
        wx.navigateTo({
          url: "/pages/open-study/authentication/index?isRenLianCheck=false&classId=" + e.currentTarget.dataset.id
                 +"&myClassId=" + e.currentTarget.dataset.item.myClassId
        })
      }else{
        wx.navigateTo({
          url: "/pages/course-learn/index?classId="+e.currentTarget.dataset.id
                 +"&myClassId=" + e.currentTarget.dataset.item.myClassId
        })
      }

      
      
    },
    toLogin(){
      wx.navigateTo({
        url: "/packages/pages/login/index?type=learn"
      })
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
        wx.setStorageSync('smrzLearn', false);
        wx.navigateTo({
          url: "/pages/certification/index?isRegister=false"
        })
    },
    hideJYTSDModal(e) {
      this.setData({
        showJYTSDialog: false,
        showJYDialog:  true,
      })

    },

    //获取是否有学习完的班级未提交结业申请
    queryuncommittedclass(){
      let that=this;
      let accountId= wx.getStorageSync('studyAccountId')
      const  chdata = {
        accountId: accountId
      };
      this.setData({
        configBean: app.globalData.configBean,
      });
      dev_request.Get('/v1/app/query-uncommitted-class.gson', chdata, function (res) {
        console.log(res);
        if(res.attribute.data!=null && res.attribute.data.length>0){
            
           for(let i=0;i<res.attribute.data.length;i++){
            if( res.attribute.data[i].classId != that.data.configBean.generalCoursesClassId){
              that.setData({
                classId:  res.attribute.data[i].classId,
                className:  res.attribute.data[i].className,
              })
              let cardNum = wx.getStorageSync('cardNum');
              let mobile = wx.getStorageSync('mobile');
              let realName = wx.getStorageSync('realName');
              that.setData({
                gz:      that.data.className,
                cardNum:  cardNum,
                phone:  mobile,
                name:  realName,
                showJYTSDialog:  true,
              })
              break;
            }
           }
          
          
        }
        
       
      }, function (err) {
        console.log(err);
       
      });
    },

    //结业申请-获取结业申请文本 
    getaccountinfo(){
      let that=this;
      const  chdata = {
      };
      train_request.Get('/login/get-account-info.gson', chdata, function (res) {
        console.log(res);
        if(res.attribute.config!=null){
          that.setData({
            configinfo:  res.attribute.config
          })
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
      classId:  that.data.classId,
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
        classId: null,
        className: '',
        name: null,
        phone:  null,
        gz: null,
        gzdj: null,
        bz: null,
        showJYDialog:  false,
      })
      that.queryuncommittedclass();
     
    }, function (err) {
      console.log(err);
      wx.hideLoading();
    });
  },
  toCenterNew() {
      wx.navigateTo({
      url: '/pages/course-center/index?typeId=0' 
    })
    
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
  toNull:function(e){
   
  },
  toCancleClass:function(e){
    let that=this;
    let id=e.currentTarget.dataset.id;
    const  data = {
        accountClassId: id
    };
    wx.showLoading({
        title: '努力加载中',
        mask: true
      });
    dev_request.Post('/v1/app/class/do-cancel.gson', data, function (res) {
      console.log(res);
      wx.hideLoading();
      
      setTimeout(function () {
        wx.showToast({
            title: res.respDesc,
            icon: 'none',
            duration: 3500
        })
      }, 100)
      that.onRefresh();
    }, function (err) {
      console.log(err);
      wx.hideLoading();
    });
  },
  toAddClass:function(e){
    console.log("classId---ss1----:"+e.currentTarget.dataset.id);
        if(e.currentTarget.dataset.item.isOver==1){
            wx.showToast({
              title: '课程已过期',
               icon: 'none',
              duration: 3500
            })
            return;
        }
        wx.redirectTo({
            url: "/pages/select-school/index?id=" + e.currentTarget.dataset.id
                 +"&className="+e.currentTarget.dataset.name
        })
  },
  showCXModal(e) {
    this.setData({
        showCXDialog: true,
        eCancleClass:e
    })
  },
  hideCXModal(e) {
    this.setData({
        showCXDialog: false
    })
  },
  hideModalCX(e) {
      let em=this.data.eCancleClass;
      this.setData({
          showCXDialog: false
      })
      this.toCancleClass(em);
      this.setData({
        eCancleClass:null
      })
  },
  },
})