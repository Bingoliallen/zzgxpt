//app.js
App({
  onLaunch: function() {
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
		if (capsule) {
		 	this.globalData.Custom = capsule;
			this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		} else {
			this.globalData.CustomBar = e.statusBarHeight + 50;
		}
      }
    })
  },
  onShow: function () {
    if (wx.canIUse('getUpdateManager')) {//判断当前微信版本是否支持版本更新
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) { // 请求完新版本信息的回调
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
                })
            });
            updateManager.onUpdateFailed(function () {
              wx.showModal({// 新的版本下载失败
                title: '已经有新版本了',
                content: '新版本已经上线，请您删除当前小程序，重新搜索打开',
              })
            })
         }
      })
       
    } else {
      wx.showModal({// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试'
      })
    }
      
  },
  globalData: {
    config:null,//获取系统相关信息
    configBean:null,//获取系统相关信息
    // DEV_URL:'http://zjjn_test_manage.ghlearning.com',
    // TRAIN_URL:'http://zjjn_test_user.ghlearning.com/train/v1',
    // imgUrl:'https://zjjn_test_user.ghlearning.com',
    // iconUrl:'https://wx_image.ghlearning.com',

    DEV_URL:'https://zjjnts-manage.ghlearning.com',
    TRAIN_URL:'https://zjjnts-train.ghlearning.com/train/v1',
    imgUrl:'https://zjjnts-manage.ghlearning.com',
    iconUrl:'https://wx-image.ghlearning.com',
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ]
  }
})