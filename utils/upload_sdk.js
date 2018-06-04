//index.js
var COS = require('./cos-wx-sdk-v5');
var config = require('./config');

var cos = new COS({
    getAuthorization: function (params, callback) {//获取签名 必填参数
        // 方法二（适用于前端调试）
        var authorization = COS.getAuthorization({
            SecretId: config.SecretId,
            SecretKey: config.SecretKey,
            Method: params.Method,
            Key: params.Key
        });
        callback(authorization);
    }
});

var uploadFile = function (filePath, callback) {
    // cos bucket的名字-账号的appid
    var Bucket = 'face-recognition-1253284991';
    // cos上传的地区ID
    var Region = 'ap-beijing';

    // 上传文件
    var uploadFile = function (filePath) {
        var fileName = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
        cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: fileName,
            FilePath: filePath,
            onProgress: function (info) {
                console.log(JSON.stringify(info));
            }
        }, function (err, data) {
            console.log(err || data);
            if (err && err.error) {
                wx.showModal({
                    title: '返回错误',
                    content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode,
                    showCancel: false
                });
            } else if (err) {
                wx.showModal({title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false});
            } else {
                wx.showToast({title: '请求成功', icon: 'success', duration: 3000});
                let location = data.Location;
                console.log(location.substr(0, location.lastIndexOf('/') + 1));
                console.log(fileName);
                callback(location.substr(0, location.lastIndexOf('/') + 1), fileName);
            }
        });
    };

    uploadFile(filePath);
};

module.exports = uploadFile;