// pages/nav-list/index.js
const dev_request = require('../../utils/dev_request.js')
const train_request = require('../../utils/train_request.js')
const app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
       CustomBar: app.globalData.CustomBar,
       imgUrl: app.globalData.imgUrl,

       elaboratelist:[],
       elaboratetype:'',
       elaborateTypeId:'',
       coursetype:'',

       totalPage: 0,
       pageNo: 1,
       PageSize: 10,

       title:'疫情防控',
       TabCur: 0,
       scrollLeft:0,
       scrollList:[
       ],
       goods: [
      ],
    },

    
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    
       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

      var _obj=options.title;        
      console.log(_obj);
      this.setData({
          title: _obj 
      });

      
      let that=this;
      let cType=false;
      if(that.data.title =='疫情防控'){
        cType=true;
      }
      const  data = {
      };
     
      train_request.Get('/rest/elaborate/query-course-type-list.gson', data, function (res) {
        console.log(res);
        if(res.attribute.data!=null){
          res.attribute.data.forEach(function(item, index){
            if(cType){
              if(item.courseTypeName == '精品课程'){
                that.setData({
                  coursetype: item.courseTypeId
                })
              }
            }else {
              if(item.courseTypeName == '非遗'){
                that.setData({
                  coursetype: item.courseTypeId
                })
              }
            }
          })
        }
  
        const  data = {
          type: that.data.coursetype
        };
        train_request.Get('/rest/elaborate/query-elaborate-type.gson', data, function (res) {
          console.log(res);
          if(res.attribute.data!=null){
            
            that.setData({
              scrollList: res.attribute.data
            })
            res.attribute.data.forEach(function(item, index){
              if(item.name == '不限'){
                that.setData({
                  elaboratetype: item.type,
                  elaborateTypeId: item.id,
                })
              
              }
            })
          }
  
        }, function (err) {
          console.log(err);
        });
  
        
        const  fydata = {
          pageNo: that.data.pageNo,
          PageSize: that.data.PageSize,
          isDesc: "",
          type: that.data.coursetype,
          // elaborateTypeId: that.data.elaborateTypeId,
        };
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });
        train_request.Post('/rest/elaborate/query-elaborate-list.gson', fydata, function (res) {
          console.log(res);
          wx.hideLoading();
          if(res.attribute.data.list!=null){
            
            that.setData({
              totalPage: res.attribute.data.totalPage
            })
             that.setData({
                elaboratelist: res.attribute.data.list
             })
          }
  
         
        }, function (err) {
          console.log(err);
          wx.hideLoading();
        });


       
  
  
  
      }, function (err) {
        console.log(err);
        wx.hideLoading();
      });
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
      let that=this;
      this.setData({
        totalPage: 0,
        pageNo: 1,
        PageSize: 10,
      })
      const  data = {
        pageNo: that.data.pageNo,
        PageSize: that.data.PageSize,
        isDesc: "",
        type: that.data.coursetype,
        elaborateTypeId: that.data.elaborateTypeId,
      };
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      train_request.Post('/rest/elaborate/query-elaborate-list.gson', data, function (res) {
        console.log(res);
        wx.hideLoading();
        if(res.attribute.data.list!=null){
          
          that.setData({
            totalPage: res.attribute.data.totalPage
          })
           that.setData({
              elaboratelist: res.attribute.data.list
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      let that=this;
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

      const  data = {
        pageNo: that.data.pageNo,
        PageSize: that.data.PageSize,
        isDesc: "",
        type: that.data.coursetype,
        elaborateTypeId: that.data.elaborateTypeId,
      };
      wx.showLoading({
        title: '努力加载中',
        mask: true
      });
      train_request.Post('/rest/elaborate/query-elaborate-list.gson', data, function (res) {
        console.log(res);
        wx.hideLoading();
        if(res.attribute.data.list!=null){
          
          that.setData({
            totalPage: res.attribute.data.totalPage
          })
           that.setData({
              elaboratelist: that.data.elaboratelist.concat(res.attribute.data.list)
           })
        }

       
      }, function (err) {
        console.log(err);
        wx.hideLoading();
      });

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    tabSelect(e) {
        let that=this;
        this.setData({
          totalPage: 0,
          pageNo: 1,
          PageSize: 10,
          elaboratetype: e.currentTarget.dataset.item.type,
          elaborateTypeId: e.currentTarget.dataset.item.id,
          TabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id-1)*60
        })

        const  data = {
          pageNo: that.data.pageNo,
          PageSize: that.data.PageSize,
          isDesc: "",
          type: that.data.coursetype,
          elaborateTypeId: that.data.elaborateTypeId,
        };
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });
        train_request.Post('/rest/elaborate/query-elaborate-list.gson', data, function (res) {
          console.log(res);
          wx.hideLoading();
          if(res.attribute.data.list!=null){
            
            that.setData({
              totalPage: res.attribute.data.totalPage
            })
             that.setData({
                elaboratelist: res.attribute.data.list
             })
          }
  
         
        }, function (err) {
          console.log(err);
          wx.hideLoading();
        });

    },
    
    toNavDetail: function(e) {
      let that=this;
      wx.navigateTo({
        url: "/pages/nav-detail/index?id=" + e.currentTarget.dataset.id+"&typeId="+that.data.coursetype
      })
    },
})