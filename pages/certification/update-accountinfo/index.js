// pages/certification/update-accountinfo/index.js
const dev_request = require('../../../utils/dev_request.js')


Page({

    /**
     * 页面的初始数据
     */
    data: {
        sfzurl:null,

        accountId:'',
        accountName:'',
        accountType:'',
        accountTypeName:'',
        cardNumber:'',
        cardType:null,
        mobile:'',
        unitName:'',
        areaName:'',
        unitId:null,
        areaId:'',
        sex:null,
        nation:'',
        address:'',
        birthDay:'',
        sexName:null,


        addressDatas:[],
        value: [0, 0, 0], // 地址选择器省市区 暂存 currentIndex
        regionValue: [0, 0, 0], // 地址选择器省市区 最终 currentIndex
        provinces: [], // 一级地址
        citys: [], // 二级地址
        areas: [], // 三级地址
        visible: false,

        index: null,//人员类别的
        sexlist: ['女', '男'],
        picker: [],
        date: '2018-12-25',
       
        isRegister: false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var isRegister=options.isRegister;  
        var _obj=options.sfzurl;        
        this.setData({
          isRegister: isRegister,
          sfzurl: _obj
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
        this.getidcardinfo();
         //this.getstuinfo();//不应该使用，因为是在完善个人信息
         this.getconfig();
         this.getdictlist();
         this.gettreelist();
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

    SexPicker(e) {
      console.log(e);
      this.setData({
        sex: e.detail.value
      })
      console.log('--性别-SexPicker--：', e.detail.value)
    },


    PickerChange(e) {
        console.log(e);
        this.setData({
          index: e.detail.value
        })
        console.log('--人员类别-PickerChange--：', this.data.picker[e.detail.value])
        this.setData({
          accountType: this.data.picker[this.data.index].a,
          accountTypeName: this.data.picker[this.data.index].n,
        })
    },

    DateChange(e) {
      this.setData({
        birthDay: e.detail.value
      })
    },

    RegionChange: function(e) {
      this.setData({
        region: e.detail.value
      })
    },

    //识别身份证照片文字信息
    getidcardinfo(){
        let that=this;
        let sfzurl= this.data.sfzurl;
        let cardNum= wx.getStorageSync('cardNum');
        if(sfzurl !=null){
          let  data = null;
          if(that.data.isRegister==true){
            data = {
              url: sfzurl,
              cardNum: ""
            };
          }else{
            if(cardNum==null || cardNum==''){
              data = {
                url: sfzurl,
                cardNum: ""
              };
            }else{
              data = {
                url: sfzurl,
                cardNum: cardNum 
              };
            }
            
          }


          wx.showLoading({
            title: '努力加载中',
            mask: true
          });
          dev_request.Get('/v1/app/get-idcard-info.gson', data, function (res) {
            console.log(res);
            wx.hideLoading();
            if(res.attribute.data!=null){
              // address: "福建省厦门市同安区西柯镇美溪三里8号403室"
              // birthDate: "19901025"
              // cardNum: "362329199010253516"
              // name: "李白冰"
              // nation: "汉"
              // sex: "男"
              that.setData({
                address:res.attribute.data.address,
                birthDay:res.attribute.data.birthDate,
                cardNumber:res.attribute.data.cardNum,
                accountName:res.attribute.data.name,
                nation:res.attribute.data.nation,
                sexName:res.attribute.data.sex,
                sex:res.attribute.data.sex,
                
              });
              if(res.attribute.data.sex !=null && res.attribute.data.sex =='男'){
                that.setData({
                  sex:1,
                  
                });
              }else if(res.attribute.data.sex !=null && res.attribute.data.sex =='女'){
                that.setData({
                  sex:0,
                  
                });
              }
              
            }

          }, function (err) {
            console.log(err);
            wx.hideLoading();
          });
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
 
              // accountId: "b7bc4ee5-3b3d-4983-ad47-d5d7eb75fcb5"
              // accountName: "李白冰"
              // accountType: "008-100"
              // accountTypeName: "企业职工"
              // address: "福建省厦门市同安区西柯镇美溪三里8号403室"
              // areaId: "410101_z140"
              // areaName: "河南省郑州市市直"
              // auditState: null
              // birthDay: "1990年10月"
              // cardNumBack: null
              // cardNumber: "3623****3516"
              // cardNumberFacade: null
              // cardType: 1
              // diploma: null
              // disableNumber: null
              // employmentDirection: null
              // headPhoto: null
              // idCardPhoto: "/group1/UIMG/20200712/c8409f44-8d5b-4fe3-8bb4-1cd62de36e34small.jpg"
              // mobile: "18250840297"
              // nation: "汉"
              // sex: 1
              // sexName: null
              // status: null
              // studentCard: null
              // unitId: null
              // unitName: "厦门市巨龙信息科技有限公司"
              // variableField1: null
              // variableField2: null
                that.setData({
                    accountId:res.attribute.data.accountId,
                    accountName:res.attribute.data.accountName,
                    accountType:res.attribute.data.accountType,
                    accountTypeName:res.attribute.data.accountTypeName,
                    cardNumber:res.attribute.data.cardNumber,
                    cardType:res.attribute.data.cardType,
                    mobile:res.attribute.data.mobile,
                    unitName:res.attribute.data.unitName,
                    areaName:res.attribute.data.areaName,
                    unitId:res.attribute.data.unitId,
                    areaId:res.attribute.data.areaId,
                    sex:res.attribute.data.sex,
                    nation:res.attribute.data.nation,
                    address:res.attribute.data.address,
                    birthDay:res.attribute.data.birthDay,
                    sexName:res.attribute.data.sexName,
                  });
            }

            
           
          }, function (err) {
            console.log(err);
          });
        }
    },
    
    toForm(){
     
      if(this.data.accountName == null|| this.data.accountName == ""){
        wx.showToast({
          title: '请输入姓名',
           icon: 'none',
          duration: 3500
        })
        return;
      }

      if(this.data.cardNumber == null|| this.data.cardNumber == ""){
        wx.showToast({
          title: '请输入身份证',
           icon: 'none',
          duration: 3500
        })
        return;
      }
      
      if(this.data.sex == null){
        wx.showToast({
          title: '请选择性别',
           icon: 'none',
          duration: 3500
        })
        return;
      }


      if(this.data.nation ==null|| this.data.nation == ""){
        wx.showToast({
          title: '请输入民族',
           icon: 'none',
          duration: 3500
        })
        return;
      }
      if(this.data.address == null|| this.data.address == ""){
        wx.showToast({
          title: '请输入住址',
           icon: 'none',
          duration: 3500
        })
        return;
      }

      if(this.data.birthDay == null|| this.data.birthDay == ""){
        wx.showToast({
          title: '请选择出生年月',
           icon: 'none',
          duration: 3500
        })
        return;
      }

      if(this.data.accountType == null|| this.data.accountType == ""){
        wx.showToast({
          title: '请选择人员类别',
           icon: 'none',
          duration: 3500
        })
        return;
      }

      if(this.data.areaId == null|| this.data.areaId == ""){
        wx.showToast({
          title: '请选择所属区域',
           icon: 'none',
          duration: 3500
        })
        return;
      }

       this.updateaccountinfo();
    },

   //1.9.	实名认证--完善内容
   updateaccountinfo(){
    // idNumber	身份证	String		是
    // userName	姓名	String		是
    // mobile	手机号	String		否
    // sex	性别	Integer		是
    // nation	民族	String		是
    // address	住址	String		是
    // unitName	单位名称	String		否
    // idCardPhoto	实名认证用身份证正面照	String		是
    // type	人员类别	Integer		否
    // areaId	区域	String		否
    // accountId	账号id	String		是
    


        let that=this;
        let sfzurl= this.data.sfzurl;
        // let cardNum= wx.getStorageSync('cardNum');
        // if(cardNum ==null){
        //     cardNum=that.data.cardNumber;
        // }
        let accountId= wx.getStorageSync('accountIdRegister');
        // if(that.data.isRegister==true){
        //   accountId= wx.getStorageSync('accountIdRegister');
        // }else{
        //   accountId = wx.getStorageSync('accountId');
        // }

        if(sfzurl !=null){
          const  data = {
            userName: that.data.accountName,
            idNumber: that.data.cardNumber,
            sex: that.data.sex,
            nation: that.data.nation,
            address: that.data.address,

            unitName: that.data.unitName,

            idCardPhoto: sfzurl,
            
            type: that.data.accountType,
            areaId:  that.data.areaId,
            accountId: accountId,
             
          };
          wx.showLoading({
            title: '努力加载中',
            mask: true
          });
          dev_request.Post('/v1/app/update-account-info.gson', data, function (res) {
            console.log(res);
            wx.hideLoading();
           
            setTimeout(function () {
              wx.showToast({
                title: res.respDesc,
                icon: 'none',
                duration: 3500
              })
            }, 100)
            wx.setStorageSync('smrzLearn', true);
            that.toLoginRef();
            
          }, function (err) {
            console.log(err);
            wx.hideLoading();
          });
        }
    },

    toLoginRef() {
      let that=this;
      let userNum=  wx.getStorageSync('mobileRegister');
      let userPwd= wx.getStorageSync('pwdRegister');
      const  data = {
        cardNumOrMobile: userNum,
        passWord: userPwd,
        roleType: '0'
      };
      dev_request.Post('/v1/app/login.gson', data, function (res) {
        console.log(res);
        wx.setStorageSync('accountIdRegister', res.attribute.data.accountId);
        wx.setStorageSync('cardNum', res.attribute.data.cardNum);
      
      
        wx.setStorageSync('accountId', res.attribute.data.accountId);
        wx.setStorageSync('unitName', res.attribute.data.unitName);
        wx.setStorageSync('cardNum', res.attribute.data.cardNum);
        wx.setStorageSync('mobile', res.attribute.data.mobile);
        wx.setStorageSync('realName', res.attribute.data.realName);
        wx.setStorageSync('isOneLogin', res.attribute.data.isOneLogin);
        wx.setStorageSync('cardType', res.attribute.data.cardType);
    
        wx.setStorageSync('accountType', res.attribute.data.accountType);
        wx.setStorageSync('idCardPhoto', res.attribute.data.idCardPhoto);
        wx.setStorageSync('firstCheckPhoto', res.attribute.data.firstCheckPhoto);
        wx.setStorageSync('studyAccountId', res.attribute.data.studyAccountId);
    
        wx.setStorageSync('sex', res.attribute.data.sex);
        wx.setStorageSync('dbNumber', res.attribute.data.dbNumber);
        
        
       
        setTimeout(function () {
          wx.navigateBack({
              delta: 1
          })
        }, 2000)  
      }, function (err) {
        console.log(err);
      });
    
    },
    
    //通用--获取配置（完善是否需要选择区域）
    getconfig(){
        let that=this;
        const  data = {
        };
        
        dev_request.Get('/v1/app/get-config.gson', data, function (res) {
          console.log(res);
          if(res.attribute!=null){
            // IDCard: "/template/idCard.png"
            // version: ""
          }
        }, function (err) {
          console.log(err);

        });
    },

    //实名认证--获取字典表数据（获取人员类别）
    getdictlist(){
        let that=this;
        const  data = {
            type: 8  //-人员类别
        };
        
        dev_request.Get('/v1/app/get-dict-list.gson', data, function (res) {
          console.log(res);
          if(res.attribute.data!=null){
            
            that.setData({
              picker:res.attribute.data,
              
            });
            // a: "008-100"
            // key: null
            // l: null
            // n: "企业职工"
            // p: null
            // path: "/008-100"
            // value: null
          }
        }, function (err) {
          console.log(err);

        });
    },

     //实名认证--获取字段表数据树形（获取区域）
     gettreelist(){
        let that=this;
        const  data = {
            type: 11  //区域
        };
        
        dev_request.Get('/v1/app/get-tree-list.gson', data, function (res) {
          console.log(res);
          if(res.attribute.data!=null){
            that.setData({
              addressDatas:res.attribute.data,
            });
            if(res.attribute.data!=null && res.attribute.data.length>0){
              var indexShengji=0;
              var indexShiji=0;
              that.setData({
                provinces: res.attribute.data,//省的数据
                citys: res.attribute.data[indexShengji].children,//市的数据
                areas: res.attribute.data[indexShengji].children[indexShiji].children //县、地级的数据
              })
         }

            // children: []
            // id: "419001_z140"
            // name: "济源市"
            // parentId: "410000_z140"
          }
        }, function (err) {
          console.log(err);

        });
    },



    xmInput:function(e){
      this.setData({
        accountName: e.detail.value
      })
    },
    sfzInput:function(e){
      this.setData({
        cardNumber: e.detail.value
      })
    },
    mzInput:function(e){
      this.setData({
        nation: e.detail.value
      })
    },
    zzInput:function(e){
      this.setData({
        address: e.detail.value
      })
    },
    dwInput:function(e){
      this.setData({
        unitName: e.detail.value
      })
    },


    pickAddress() {
      this.setData({
        visible: true,
        value: [...this.data.regionValue]
      })
    },

 // 处理省市县联动逻辑 并保存 value
  cityChange(e) {
    var value = e.detail.value
   
    var provinceNum = value[0]
    var cityNum = value[1]
    var areaNum = value[2]

    if (this.data.value[0] != provinceNum) {
      
      this.setData({
        value: [provinceNum, 0, 0],
        citys: this.data.provinces[provinceNum].children ,
        areas: this.data.provinces[provinceNum].children[cityNum].children
      })
    } else if (this.data.value[1] != cityNum) {
   
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: this.data.provinces[provinceNum].children[cityNum].children
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, areaNum]
      })
    }
  },


 // 点击地区选择取消按钮
  cityCancel(e) {
    this.setData({
      visible: false
    })
  },

  // 点击地区选择确定按钮
  citySure(e) {
    var value = this.data.value
    this.setData({
      visible: false
    })
    // 将选择的城市信息显示到输入框
    try {
      var regionid=null;
      var region =
        (this.data.provinces[value[0]].name || '') +
        (this.data.citys[value[1]].name || '')
      if (this.data.areas.length > 0) {
        region = region + this.data.areas[value[2]].name || '';
        regionid =this.data.areas[value[2]].id
      } else {
        this.data.value[2] = 0
        regionid =this.data.citys[value[1]].id
      }
    } catch (error) {
      console.log('adress select something error')
    }

    this.setData({
      areaName: region,
      areaId: regionid,
      regionValue: [...this.data.value]
    })
  },






})