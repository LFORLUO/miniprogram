const AV = require('../module/av-weapp-min');
Page({
  data: {
    image:true,
    content: "",
    editedcontent:"",
    touchStartTime: 0,
    touchEndTime: 0,
    lastTapTime: 0,
    lastTapTimeoutFunc: null,
  },
  onLoad:function(options){
    // var randomnum = Math.floor(Math.random() * 13);
    // console.log(randomnum)
    // var storyid = this.data.storyid;
    // if (storyid  == randomnum) { this.onLoad() }
    // else {
    //   // var randomnum = randomnum * 8;
    //   this.setData({ storyid: randomnum })
    // }
    // var that = this
    // var querysnip = new AV.Query('snippet');
    // var querystory = new AV.Query('story');
    // var storyid = this.data.storyid
    // this.setData({storyid : storyid})
    // querystory.greaterThan('storyid', storyid)
    // // querystory.limit(8);
    // querystory.find().then(stories => this.setData({ stories }))
    // querysnip.find().then(snippets => this.setData({ snippets }))
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500)
  },
  onShow:function(){
    // var storyid = this.data.storyid
    var querysnip = new AV.Query('snippet');
    var querystory = new AV.Query('story');
    // querystory.greaterThan('storyid', storyid)
    // querystory.limit(8);
    querysnip.find().then(snippets => this.setData({ snippets }))
    querystory.find().then(stories => this.setData({ stories }))
    const user = AV.User.current();
    this.setData({ user: user })
    this.setAniation();
  },
  onPullDownRefresh:function(){
    var that = this
    setTimeout(function(){
    that.onLoad(),400})
  },
  changestoryid:function(){
    var storyid = this.data.storyid;
    storyid++;
    this.setData({storyid : storyid})
    this.onShow()
  },
  updatecontent: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      content: value
    }
    );
  },
//add new snippet
  addsnippet: function (event) {
    var storyid = event.currentTarget.dataset.storyId;
    var currstory = AV.Object.createWithoutData('story',storyid);
    const user = AV.User.current();
    var avatar = user.get('avatarUrl');
    var nickName = user.get('nickName');
    currstory.fetch().then(function(){
    var snipnum = currstory.get('snipnum');
    snipnum++;
    currstory.set('snipnum',snipnum)
    currstory.save()
    })
    var newsnippet = new AV.Object('snippet');
    newsnippet.set('nickName',nickName);
    newsnippet.set('content',this.data.content);
    newsnippet.set('avatar',avatar);
    newsnippet.set('user',user);
    newsnippet.set('include',currstory);
    newsnippet.save()
      .then(function (story) {
        // 成功保存之后，执行其他逻辑
        // 获取 objectId
        // var objectId = story.id;
      }, function (error) { });
    this.setData({
      avatar: avatar,
      content:''
    });
    var that = this;
    setTimeout(function(){that.onShow()},500)
  },
//edit snippet
  editsnip: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    this.setData({
      editedsnip: this.data.snippets.filter(currsnip => currsnip.id === id)[0] || {},
      image:true
    });
  },
  updateeditedcontent: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      editedcontent: value
    }
    );
  },
//cancel edit 
  canceledit:function(){
    var that = this
    setTimeout(function () { that.setData({ 
      editedsnip: {},
      editedcontent:"", }) }, 300)
  },
//done edit
  doneedit:function(event){
    var snippetid = event.currentTarget.dataset.id;
    var currsnip =AV.Object.createWithoutData('snippet', snippetid);
    if(this.data.editedcontent != ""){
    currsnip.set("content",this.data.editedcontent);
    currsnip.save().then(function (story) {

    }, function (error) { });
    }
    else{}
    var that = this;
    setTimeout(function () { 
      that.setData({ editedsnip: {},editdcontent:"" })
      that.onShow() }, 500)
  },
//点赞
  uplike:function(event){
    var snippetid = event.currentTarget.dataset.id;
    var currsnip = new AV.Query('snippet')
    var that = this;
    const user = AV.User.current();
    currsnip.get(snippetid).then(function(snippet){
      var likenum = snippet.get('likenum')
      likenum++;
      that.setData({ likenum: likenum })
      snippet.set('likenum',likenum);
      snippet.save();
    }),function(error){console.log(error)}
    setTimeout(function () {
      that.onShow();
    }, 250)

//动画
    // var animation = wx.createAnimation({
    //   timingFunction:"ease-in-out"
    // })
    // animation.scale(2,2).rotate(45).step().translate(30).step({duration:1000})

    // this.animationUp.scale(2).step();
    // this.setData({
    //   animationUp:this.animationUp.export()
    // })
    // setTimeout(function(){
    //   this.animationUp.scale(1).step();
    //   this.setData({
    //     animationUp: this.animationUp.export()
    //   })
    // }.bind(this),300)
  },
//double click
  touchStart: function (e) {
    this.setData({touchStartTime : e.timeStamp})
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.setData({touchEndTime : e.timeStamp})
  },
  doubleTap: function (event) {
    
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.data.touchEndTime - that.data.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = event.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        var snippetid = event.currentTarget.dataset.id;
        var currsnip = new AV.Query('snippet')
        var that = this;
        const user = AV.User.current();
        currsnip.get(snippetid).then(function (snippet) {
          var likenum = snippet.get('likenum')
          likenum++;
          snippet.set('likenum', likenum);
          snippet.save();
        }), function (error) { console.log(error) }
        setTimeout(function () {
          that.onShow();
        }, 250)
      }
    }
  },
  //动画
  setAniation: function () {
    var animationUp = wx.createAnimation({
      timingFunction: "ease-in-out"
    })
    this.animationUp = animationUp
  },
});