const AV = require('./module/av-weapp-min.js');
AV.init({
  appId: 'eG3UbibGdXY1xr6eVavCm4EC-gzGzoHsz',
  appKey: 'jAKkLiKjJGSnVH3lhrVbdK5B',
});
App({
  onShow: function () {
    AV.User.loginWithWeapp()
    const user = AV.User.current();
    wx.getUserInfo({
      success:({userInfo}) => {user.set(userInfo).save().then(user => {
        this.globalData.user = user.toJSON();}).catch(console.error);}
      })},
  globalData: {
    userInfo: null
  }
})

