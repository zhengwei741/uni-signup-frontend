Component({
  data: {
    selected: 0,
    color: '#7A7E83',
    selectedColor: '#3cc51f',
    list: [
      {
        pagePath: '/pages/hot/index',
        selectedIconPath: '/static/tabbar_home_on.png',
        iconPath: '/static/tabbar_home.png',
        text: '热门活动'
      },
      {
        pagePath: '/pages/myCreated/index',
        selectedIconPath: '/static/tabbar_cate_on.png',
        iconPath: '/static/tabbar_cate.png',
        text: '我创建的'
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})
