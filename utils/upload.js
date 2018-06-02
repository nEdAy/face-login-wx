
import cfg from "./config.js";

var uploadFile = function (filePath, callback) {
  // 鉴权服务器地址
  var SignatureUrl = cfg.BaseURL + '/v1/newAuthorization';
  // cos bucket的名字-账号的appid
  var Bucket = 'face-recognition-1253284991';
  // cos上传的地区ID
  var Region = 'ap-beijing';
  // cos上传的URL
  var prefixCosUrl = 'https://' + Bucket + '.cos.' + Region + '.myqcloud.com/';

  // 计算签名
  var getAuthorization = function (options, callback) {
    wx.request({
      method: 'GET',
      url: SignatureUrl, // 服务端签名，参考 server 目录下的两个签名例子
      data: {
        method: options.method,
        pathname: options.pathname,
      },
      dataType: 'json',
      success: function (result) {
        callback(result.data);
      }
    });
  };

  // 上传文件
  var uploadFile = function (filePath) {
    var fileName = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
    getAuthorization({ method: 'post', pathname: '/' }, function (AuthData) {
      var requestTask = wx.uploadFile({
        url: prefixCosUrl,
        name: 'file',
        filePath: filePath,
        formData: {
          'key': fileName,
          'success_action_status': 200,
          'Signature': AuthData.Authorization,
          'x-cos-security-token': AuthData.XCosSecurityToken,
          'Content-Type': '',
        },
        success: function (res) {
          if (res.statusCode == 200) {
            console.log(res);
            console.log(prefixCosUrl + fileName);
            callback(prefixCosUrl, fileName);
          } else {
            wx.showModal({ title: '上传失败', content: JSON.stringify(res), showCancel: false });
          }
        },
        fail: function (res) {
          wx.showModal({ title: '上传失败', content: JSON.stringify(res), showCancel: false });
        }
      });
      requestTask.onProgressUpdate(function (res) {
        console.log('正在进度:', res);
      });
    });
  };

  uploadFile(filePath);
};

module.exports = uploadFile;