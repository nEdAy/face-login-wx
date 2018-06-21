//index.js

import upload from "../../utils/upload_sdk.js";

//获取应用实例
var app = getApp()
Page({

  data: {
    j: 1,//帧动画初始图片
    isSpeaking: false,//是否正在说话
    voices: [],//音频数组
  },

  onLoad: function () {
    var that = this;
    this.recorderManager = wx.getRecorderManager();

    this.recorderManager.onError(function () {
      //that.tip("录音失败！")


      //录音失败
      wx.showModal({
        title: '提示',
        content: '录音的姿势不对!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return
          }
        }
      })
    });

    this.recorderManager.onStop(function (res) {
      // that.setData({
      //   src: res.tempFilePath
      // })
      // console.log(res.tempFilePath)
      //that.tip("录音完成！")

      //临时路径,下次进入小程序时无法正常使用
      var tempFilePath = res.tempFilePath
      console.log("tempFilePath: " + tempFilePath)
      //持久保存
      wx.saveFile({
        tempFilePath: tempFilePath,
        success: function (res) {
          //持久路径
          //本地文件存储的大小限制为 100M
          var savedFilePath = res.savedFilePath
          console.log("savedFilePath: " + savedFilePath)
        }
      })
      wx.showToast({
        title: '恭喜!录音成功',
        icon: 'success',
        duration: 1000
      })
      //获取录音音频列表
      wx.getSavedFileList({
        success: function (res) {
          var voices = [];
          for (var i = 0; i < res.fileList.length; i++) {
            //格式化时间
            var createTime = new Date(res.fileList[i].createTime)
            //将音频大小B转为KB
            var size = (res.fileList[i].size / 1024).toFixed(2);
            var voice = { filePath: res.fileList[i].filePath, createTime: createTime, size: size };
            console.log("文件路径: " + res.fileList[i].filePath)
            console.log("文件时间: " + createTime)
            console.log("文件大小: " + size)
            voices = voices.concat(voice);
          }
          that.setData({
            voices: voices
          })
        }
      })
    });
    that.innerAudioContext = wx.createInnerAudioContext();
    that.innerAudioContext.onError((res) => {
      console.log("播放录音失败！" + res)
    })

  },

  //手指按下
  touchdown: function () {
    console.log("手指按下了...")
    console.log("new date : " + new Date)
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true
    })
    //开始录音
    this.recorderManager.start({
      format: 'mp3'
    })
  },

  //手指抬起
  touchup: function () {
    console.log("手指抬起了...")
    this.setData({
      isSpeaking: false,
    })
    clearInterval(this.timer)
    this.recorderManager.stop()
  },

  //点击播放录音
  gotoPlay: function (e) {
    var filePath = e.currentTarget.dataset.key;
    //点击开始播放
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    this.innerAudioContext.src = filePath;
    this.innerAudioContext.play()

   //  upload(filePath, function (prefixCosUrl, fileName) {
      // console.log("prefixCosUrl=" + prefixCosUrl + fileName);
    // });
  }
})

//麦克风帧动画
function speaking() {
  var _this = this;
  //话筒帧动画
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}