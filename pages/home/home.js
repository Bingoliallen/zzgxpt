// pages/home/home.js
const app = getApp();
const dev_request = require('../../utils/dev_request.js')
const train_request = require('../../utils/train_request.js')


 Component({
    options: {
      addGlobalClass: true,
    },

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    classlist:[],
    qyclasslist:[],
    bannerList:[],

    elaboratelist:[],
    fyelaboratelist:[],
    elaboratetype:'',
    coursetype:'',//精品课程
    courseTypeId:'',//非遗

    imgUrl: app.globalData.imgUrl,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,

    wzlist:[],//文章列表总称
    TabCur: 0,
    typeId:'',
    scrollLeft:0,
    navName:'通知公告',
    url:'/images/js_images_banner_1.png',
    scrollList: [{
      id: 0,
      name: '通知公告',
    }, {
      id: 1,
      name: '工作动态',
    }, {
      id: 2,
      name: '法律法规',
    }],
    swiperList: [],
    list: [
    ],
    newsList:[],
    gridCol:5,
    skin: false,
    goods: [
    

    ],
  },
  
  attached() {
     this.onRefreshAll();
  },

  methods: {
    onRefreshAll(){
      let that=this;
      let accountId= wx.getStorageSync('accountId');
      if(accountId== null || accountId==''){
        that.setData({
          isLogin: false 
        })
      }else {
        that.setData({
          isLogin: true 
        })
      }
  
      //广告轮播列表
      const  bdata = {
        type:1,
        platform:3,
      };
      train_request.Get('/rest/class/query-platform-banner.gson', bdata, function (res) {
        console.log(res);
        if(res.attribute.data!=null){
          that.setData({
            bannerList: res.attribute.data
          })
        }
      }, function (err) {
        console.log(err);
       
      });
      
      
      //培训课程列表
      if(that.data.isLogin){
        let cardNum= wx.getStorageSync('cardNum');
        const pxdata = {
            cardNum: cardNum,
            type: 0,
            size: 6,//条数
            start: 1//当前页
        };
        dev_request.Post('/v1/app/query-class-list.gson', pxdata, function (res) {
          console.log(res);
          if(res.attribute!=null){
             that.setData({
              classlist: res.attribute.list
             })
          }
        }, function (err) {
          console.log(err);
        });
      }else{
              const  pxdata = {
                  type: 0,
                  size: 6,//条数
                  start: 1//当前页
              };
              dev_request.Post('/v1/app/query-class-list-nologin.gson', pxdata, function (res) {
                console.log(res);
                if(res.attribute!=null){
                   that.setData({
                    classlist: res.attribute.list
                   })
                }
              }, function (err) {
                console.log(err);
              });
      }
  
      //企业定制列表
      if(that.data.isLogin){
        let cardNum= wx.getStorageSync('cardNum');
        const qydata = {
            cardNum: cardNum,
            type: 1,
            start: 1,//当前页
            size: 6//条数
        };
        dev_request.Post('/v1/app/query-class-list.gson', qydata, function (res) {
          console.log(res);
          if(res.attribute!=null){
             that.setData({
              qyclasslist: res.attribute.list
             })
          }
          wx.hideNavigationBarLoading(); //完成停止加载图标
          wx.stopPullDownRefresh();
        }, function (err) {
          console.log(err);
          wx.hideNavigationBarLoading(); //完成停止加载图标
          wx.stopPullDownRefresh();
        });
      }else{
              const  qydata = {
                  type: 1,
                  start: 1,//当前页
                  size: 6//条数
              };
              dev_request.Post('/v1/app/query-class-list-nologin.gson', qydata, function (res) {
                console.log(res);
                if(res.attribute!=null){
                   that.setData({
                    qyclasslist: res.attribute.list
                   })
                }
                wx.hideNavigationBarLoading(); //完成停止加载图标
                wx.stopPullDownRefresh();
              }, function (err) {
                console.log(err);
                wx.hideNavigationBarLoading(); //完成停止加载图标
                wx.stopPullDownRefresh();
              });
      }
  
      //疫情防控列表和非遗列表
      const  yqdata = {
      };
      train_request.Get('/rest/elaborate/query-course-type-list.gson', yqdata, function (res) {
        console.log(res);
        if(res.attribute.data!=null){
          res.attribute.data.forEach(function(item, index){
            if(item.courseTypeName == '精品课程'){
              that.setData({
                coursetype: item.courseTypeId
              })
            }else if(item.courseTypeName == '非遗'){
              that.setData({
                courseTypeId: item.courseTypeId
              })
            }
            
          })
        }
  
        // const  data = {
        //   type: that.data.coursetype
        // };
        // train_request.Get('/rest/elaborate/query-elaborate-type.gson', data, function (res) {
        //   console.log(res);
        //   if(res.attribute.data!=null){
        //     res.attribute.data.forEach(function(item, index){
        //       if(item.name == '不限'){
        //         that.setData({
        //           elaboratetype: item.type
        //         })
              
        //       }
        //     })
        //   }
        // }, function (err) {
        //   console.log(err);
        // });
  
        const  fkdata = {
          pageNo: 1,
          PageSize: 6,
          isDesc: "",
          type: that.data.coursetype
        };
        train_request.Post('/rest/elaborate/query-elaborate-list.gson', fkdata, function (res) {
          console.log(res);
          if(res.attribute.data.list!=null){
             that.setData({
                elaboratelist: res.attribute.data.list
             })
          }
        }, function (err) {
          console.log(err);
        });
  
        const  fydata = {
          pageNo: 1,
          PageSize: 6,
          isDesc: "",
          type: that.data.courseTypeId
        };
        train_request.Post('/rest/elaborate/query-elaborate-list.gson', fydata, function (res) {
          console.log(res);
          if(res.attribute.data.list!=null){
             that.setData({
                fyelaboratelist: res.attribute.data.list
             })
          }
        }, function (err) {
          console.log(err);
        });
  
      }, function (err) {
        console.log(err);
      });
  
      //法律法规列表
      let url='http://zjjnts.ghlearning.com/app.jspx?template=abc&nodeId=4515';
      const flfgdata = {
        type: 1,
        'url':url
      };
      train_request.Post('/rest/springboard/get-data.gson', flfgdata, function (res) {
        console.log(res);
        if(res.attribute!=null){
           that.setData({
               flfglist: res.attribute[url]
           })
           if(that.data.TabCur==0){
            that.setData({
              wzlist: that.data.tzlist
            })
           }else  if(that.data.TabCur==1){
            that.setData({
              wzlist: that.data.gzlist
            })
           }else  if(that.data.TabCur==2){
            that.setData({
              wzlist: that.data.flfglist
            })
           }
        }
      }, function (err) {
        console.log(err);
      });
  
     //通知公告
     let tzurl='http://zjjnts.ghlearning.com/app.jspx?template=abc&nodeId=4514';
     const tzdata = {
      type: 1,
       'url':tzurl
     };
     train_request.Post('/rest/springboard/get-data.gson', tzdata, function (res) {
       console.log(res);
       if(res.attribute!=null){
          that.setData({
              tzlist: res.attribute[tzurl]
          })
          if(that.data.TabCur==0){
            that.setData({
              wzlist: that.data.tzlist
            })
           }else  if(that.data.TabCur==1){
            that.setData({
              wzlist: that.data.gzlist
            })
           }else  if(that.data.TabCur==2){
            that.setData({
              wzlist: that.data.flfglist
            })
           }
       }
     }, function (err) {
       console.log(err);
     });
  
     //工作动态
     let gzurl='http://zjjnts.ghlearning.com/app.jspx?template=abc&nodeId=4513';
     const gzdata = {
      type: 1,
       'url':gzurl
     };
     train_request.Post('/rest/springboard/get-data.gson', gzdata, function (res) {
       console.log(res);
       if(res.attribute!=null){
          that.setData({
              gzlist: res.attribute[gzurl]
          })
          if(that.data.TabCur==0){
            that.setData({
              wzlist: that.data.tzlist
            })
           }else  if(that.data.TabCur==1){
            that.setData({
              wzlist: that.data.gzlist
            })
           }else  if(that.data.TabCur==2){
            that.setData({
              wzlist: that.data.flfglist
            })
           }
       }
     }, function (err) {
       console.log(err);
     });
    },
    onRefresh(){
         let that=this;
         //培训课程列表
         if(that.data.isLogin){
          let cardNum= wx.getStorageSync('cardNum');
          const pxdata = {
              cardNum: cardNum,
              type: 0,
              size: 6,//条数
              start: 1//当前页
          };
          dev_request.Post('/v1/app/query-class-list.gson', pxdata, function (res) {
            console.log(res);
            if(res.attribute!=null){
               that.setData({
                classlist: res.attribute.list
               })
            }
          }, function (err) {
            console.log(err);
          });
        }else{
                const  pxdata = {
                    type: 0,
                    size: 6,//条数
                    start: 1//当前页
                };
                dev_request.Post('/v1/app/query-class-list-nologin.gson', pxdata, function (res) {
                  console.log(res);
                  if(res.attribute!=null){
                     that.setData({
                      classlist: res.attribute.list
                     })
                  }
                }, function (err) {
                  console.log(err);
                });
        }

          //企业定制列表
          if(that.data.isLogin){
            let cardNum= wx.getStorageSync('cardNum');
            const qydata = {
                cardNum: cardNum,
                type: 1,
                start: 1,//当前页
                size: 6//条数
            };
            dev_request.Post('/v1/app/query-class-list.gson', qydata, function (res) {
              console.log(res);
              if(res.attribute!=null){
                 that.setData({
                  qyclasslist: res.attribute.list
                 })
              }
            }, function (err) {
              console.log(err);
            });
          }else{
                  const  qydata = {
                      type: 1,
                      start: 1,//当前页
                      size: 6//条数
                  };
                  dev_request.Post('/v1/app/query-class-list-nologin.gson', qydata, function (res) {
                    console.log(res);
                    if(res.attribute!=null){
                       that.setData({
                        qyclasslist: res.attribute.list
                       })
                    }
                  }, function (err) {
                    console.log(err);
                  });
          }
    },
    tabSelect(e) {
      this.setData({
        typeId: e.currentTarget.dataset.item.id,
        navName: e.currentTarget.dataset.item.name,
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id-1)*60
      })
      if(this.data.TabCur==0){
        this.setData({
          wzlist: this.data.tzlist
        })
       }else  if(this.data.TabCur==1){
        this.setData({
          wzlist: this.data.gzlist
        })
       }else  if(this.data.TabCur==2){
        this.setData({
          wzlist: this.data.flfglist
        })
       }

    },
    toCourseCenter() {
      
    },
    more1() {
      wx.navigateTo({
        url: '/pages/course-center/index?typeId=0',
      });
    },
    more2() {
      wx.navigateTo({
        url: '/pages/course-center/index?typeId=1',
      });
    },
    more4() {
      wx.navigateTo({
        url: '/pages/news-list/index?title='+this.data.navName
             +'&typeId='+this.data.typeId+'&TabCur='+this.data.TabCur,
      });
    },
    more5() {
      wx.navigateTo({
        url: '/pages/nav-list/index?title=非遗',
      });
    },
    toYqfk() {
      wx.navigateTo({
        url: '/pages/nav-list/index?title=疫情防控',
      });
    },
    toCourseDetail0: function(e) {
      if(this.data.isLogin==false){
          wx.navigateTo({
            url: "/packages/pages/login/index?type=learn"
          })
          return;
      }
      if(e.currentTarget.dataset.item.isOver==1){
        wx.showToast({
          title: '课程已过期',
           icon: 'none',
          duration: 3500
        })
        return;
      }
      let accountClassId=e.currentTarget.dataset.item.accountClassId;
      if(accountClassId==null ||accountClassId ==''){
        wx.navigateTo({
          url: "/pages/course-detail/index?typePxd=true&id=" + e.currentTarget.dataset.id
               +"&attribute="+e.currentTarget.dataset.item.attribute
               +"&attributeCls="+e.currentTarget.dataset.item.attributeCls
        })
      }else{
        
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
        
      }
      
    },
    toCourseDetail: function(e) {
      if(this.data.isLogin==false){
        wx.navigateTo({
          url: "/packages/pages/login/index?type=learn"
        })
        return;
      }
      wx.navigateTo({
        url: "/pages/course-detail/index?id=" + e.currentTarget.dataset.id
               +"&attribute="+e.currentTarget.dataset.item.attribute
               +"&attributeCls="+e.currentTarget.dataset.item.attributeCls
      })
    },
    toNavDetail: function(e) {
      let typeId=this.data.coursetype
      wx.navigateTo({
        url: "/pages/nav-detail/index?id=" + e.currentTarget.dataset.id+"&typeId="+typeId
      })
    },
    toNavDetailfy: function(e) {
      let typeId=this.data.courseTypeId
      wx.navigateTo({
        url: "/pages/nav-detail/index?id=" + e.currentTarget.dataset.id+"&typeId="+typeId
      })
    },

    //跳转到新闻详情页
    goNewsDetail: function(e) {
     
      let str =e.currentTarget.dataset.id;
     // let str1 = str.replace('https://zjjnts.ghlearning.com:80', 'https://zjjnts.ghlearning.com');
      wx.navigateTo({
        url: '/pages/webview/index?newsUrl=' + str
      })
    },
  }
})