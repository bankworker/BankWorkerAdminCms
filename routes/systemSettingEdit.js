let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('systemSettingEdit', { title: '系统信息编辑', systemID: req.query.systemID });
});

router.get('/detail', function (req, res, next) {
  let service = new commonService.commonInvoke('systemSetting');
  let parameter = req.query.systemID + '/N';

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
        systemInfo: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('systemSetting');
  let data = {
    systemName: req.body.systemName,
    systemPrice: req.body.systemPrice,
    servicePrice: req.body.servicePrice,
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
  let service = new commonService.commonInvoke('systemSetting');
  let data = {
    systemID: req.body.systemID,
    systemName: req.body.systemName,
    systemPrice: req.body.systemPrice,
    servicePrice: req.body.servicePrice,
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