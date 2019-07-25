let express = require('express');
let commonService = require('../service/commonService');
let uploadUtils = require('../common/uploadUtils');
let router = express.Router();
let upload = uploadUtils.createUploadObject(['public','upload','bank']);

router.get('/', function(req, res, next) {
  res.render('bankEdit', { title: '银行信息编辑', bankID: req.query.bankID });
});

router.post('/fileUpload',  upload.array('file', 10), function(req,res,next){
  let uploadImageUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadImageUrlArray.push('http://' + req.headers.host + '/upload/bank/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadImageUrlArray
  });
  res.end();
});

router.get('/bankCode/exist', function (req, res, next) {
  let service = new commonService.commonInvoke('bankCodeExist');
  let bankCode = req.query.bankCode;

  service.get(bankCode, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        exist: result.content.totalCount > 0
      });
    }
  });
});

router.get('/detail', function (req, res, next) {
  let service = new commonService.commonInvoke('bank');
  let parameter = req.query.bankID + '/N';

  service.get(parameter, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        bankInfo: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('bank');
  let data = {
    bankCode: req.body.bankCode,
    bankName: req.body.bankName,
    bankLogo: req.body.bankLogo,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('bank');
  let data = {
    bankID: req.body.bankID,
    bankCode: req.body.bankCode,
    bankName: req.body.bankName,
    bankLogo: req.body.bankLogo,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

module.exports = router;
