// pages/add/add.js
import cfg from "../../utils/config.js";
import upload from "../../utils/upload_sdk.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCamera: false,
    isRecord: false,
    src: '',
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  // 用户名输入
  bindInputUser(e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 密码输入
  bindInputPwd(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 保存用户
  addUser(e) {
    const that = this;
    if (that.data.username === '') {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.showLoading({
      title: '正在注册',
    })
    upload(that.data.src, function (prefixCosUrl, fileName) {
      wx.request({
        method: 'POST',
        url: cfg.BaseURL + '/v1/user', //仅为示例，非真实的接口地址
        data: {
          'username': that.data.username,
          'password': that.data.password,
          'prefixCosUrl': prefixCosUrl,
          'fileName': fileName
        },
        dataType: 'json',
        success: function (res) {
          console.log(res);
          if (res.statusCode == 201) {
            wx.showToast({
              title: '用户添加成功',
              icon: 'success',
              duration: 2000
            });
            wx.switchTab({
              url: '/pages/user/user'
            })
          } else {
            wx.showToast({
              title: res.data.error,
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '用户添加失败',
            icon: 'none',
            duration: 2000
          });
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    });

  },

  // 重拍
  reTakePhoto() {
    this.setData({
      isCamera: false
    });
  },

  // 拍照
  takePhoto() {
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'normal',
      success: (res) => {
        this.setData({
          src: res.tempImagePath,
          isCamera: true
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '拍照错误',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  error(e) {
    wx.showToast({
      title: '请允许小程序使用摄像头',
      icon: 'none',
      duration: 2000
    });
  }

});