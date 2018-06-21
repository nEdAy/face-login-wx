//app.js

var qcloud = require('./bower_components/wafer-client-sdk/index.js');

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    });
};

App({
    onLaunch: function () {
    

    },

    /**
     * 点击「清除会话」按钮
     */
    clearSession() {
        // 清除保存在 storage 的会话信息
        qcloud.clearSession();
        showSuccess('会话已清除');
    },

    /**
     * 点击「请求」按钮，测试带会话请求的功能
     */
    doRequest() {
        showBusy('正在请求');

        // qcloud.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
        qcloud.request({
            // 要请求的地址
            url: this.data.requestUrl,

            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            login: true,

            success(result) {
                showSuccess('请求成功完成');
                console.log('request success', result);
            },

            fail(error) {
                showModel('请求失败', error);
                console.log('request fail', error);
            },

            complete() {
                console.log('request complete');
            }
        });
    }

});