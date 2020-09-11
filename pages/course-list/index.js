// pages/course-list/index.js
const dev_request = require('../../utils/dev_request.js')
const train_request = require('../../utils/train_request.js')
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showCXDialog:false,
        showDialogBB:false,
        showDialog:false,
        isAdd:false,
        isLogin:false,

        pageTotal:0,
        pageNo:1,
        pageSize:10,
        imgUrl: app.globalData.imgUrl,

        typeId:-1,
        title:'',
        majorId:'',
        list:[],
        newsList:[],
        eCancleClass:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        console.log("isLogin----:"+this.data.isLogin);

        var _obj=options.title;   
        var typeId=options.typeId;  
        var id=options.id;  
        console.log(_obj);
        console.log("typeId----:"+typeId);
        this.setData({
            title: _obj ,
            typeId: typeId,
            majorId: id 
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
        this.getData(false);
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
        this.getData(false);
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
          this.getData(true);

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    goLearn: function(e) {
        let accountClassId=e.currentTarget.dataset.item.accountClassId;
        if(accountClassId==null ||accountClassId ==''){
            
        }else{
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
                wx.redirectTo({
                    url: "/pages/open-study/authentication/index?isRenLianCheck=false&classId=" + e.currentTarget.dataset.id
                    +"&myClassId=" + e.currentTarget.dataset.item.myClassId
                  })
            }else{
                wx.redirectTo({
                    url: "/pages/course-learn/index?classId="+e.currentTarget.dataset.id
                           +"&myClassId=" + e.currentTarget.dataset.item.myClassId
                })
            }
            
        }
    },
    goDetail: function(e) {
        let accountClassId=e.currentTarget.dataset.item.accountClassId;
        if(this.data.typeId==0){
            if(e.currentTarget.dataset.item.isOver==1){
                wx.showToast({
                  title: '课程已过期',
                   icon: 'none',
                  duration: 3500
                })
                return;
            }
            if(accountClassId==null ||accountClassId ==''){
                wx.navigateTo({
                    url: "/pages/course-detail/index?typePxd=true&id=" + e.currentTarget.dataset.id
                        +"&attribute="+e.currentTarget.dataset.item.attribute
                        +"&attributeCls="+e.currentTarget.dataset.item.attributeCls
                })
            }else{
                
                if(e.currentTarget.dataset.item.isCheckFace==1){
                    wx.setStorageSync('isRenLianCheckSuss', null);
                    wx.redirectTo({
                        url: "/pages/open-study/authentication/index?isRenLianCheck=false&classId=" + e.currentTarget.dataset.id
                        +"&myClassId=" + e.currentTarget.dataset.item.myClassId
                      })
                }else{
                    wx.redirectTo({
                        url: "/pages/course-learn/index?classId="+e.currentTarget.dataset.id
                               +"&myClassId=" + e.currentTarget.dataset.item.myClassId
                    })
                }
               
            }
            // if(this.data.isAdd){
            //     wx.navigateTo({
            //         url: "/pages/course-learn/index?typePxd=true&classId=" + e.currentTarget.dataset.id+"&myClassId="+e.currentTarget.dataset.item.myClassId
            //     })
            // }else{
                
            // }
            
        }else if(this.data.typeId==1){
            wx.navigateTo({
                url: "/pages/course-detail/index?id=" + e.currentTarget.dataset.id
                     +"&attribute="+e.currentTarget.dataset.item.attribute
                     +"&attributeCls="+e.currentTarget.dataset.item.attributeCls
            })
        }
    },

    toAddClass1: function(e) {
        this.setData({
            isAdd: true,
        })
        this.showModalBB();
    },
    
    toAddClass: function(e) {
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

    showModalBB() {
        this.setData({
            showDialogBB: true
        })
    },
    hideModalBB(e) {
        this.setData({
            showDialogBB: false
        })
    },
    hideModalAddBB(e) {
        this.setData({
            showDialogBB: false
        })
        this.showModal();
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
          this.todelClass(em);
          this.setData({
            eCancleClass:null
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
    },
    hideModalStudy(e) {
        this.setData({
            showDialog: false
        })
        //跳转至学习首页
        wx.reLaunch({
            url: '/pages/index/index?PageCur=learn',
        });
    },

    getData(isMore){
        let that=this;
        if(that.data.isLogin){
            let cardNum= wx.getStorageSync('cardNum');
            const  data = {
                cardNum: cardNum,
                type: that.data.typeId,
                start: that.data.pageNo,//条数
                size: that.data.pageSize,//当前页
                majorId: that.data.majorId
            };
            wx.showLoading({
                title: '努力加载中',
                mask: true
              });
            dev_request.Post('/v1/app/query-class-list.gson', data, function (res) {
              console.log(res);
              wx.hideLoading();
              if(res.attribute!=null){
                 that.setData({
                  pageTotal: res.attribute.pageTotal,
                 })
                 if(isMore){
                    that.setData({
                        list: that.data.list.concat(res.attribute.list)
                    })
                    
                 }else{
                    that.setData({
                        list: res.attribute.list
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
        }else{
            const  data = {
                type: that.data.typeId,
                start: that.data.pageNo,//条数
                size: that.data.pageSize,//当前页
                majorId: that.data.majorId
            };
            wx.showLoading({
                title: '努力加载中',
                mask: true
              });
            dev_request.Post('/v1/app/query-class-list-nologin.gson', data, function (res) {
              console.log(res);
              wx.hideLoading();
              if(res.attribute!=null){
                 that.setData({
                  pageTotal: res.attribute.pageTotal,
                 })
                 if(isMore){
                    that.setData({
                        list: that.data.list.concat(res.attribute.list)
                    })
                    
                 }else{
                    that.setData({
                        list: res.attribute.list
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
        }
       
    },

    /**
     * 撤销报名
    */
    todelClass: function(e){
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
          that.setData({
            pageNo: 1,
            pageTotal: 0,
           })
          that.getData(false);
        }, function (err) {
          console.log(err);
          wx.hideLoading();
        });
    }
})