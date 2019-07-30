let express = require('express');
let commonService = require('../service/commonService');
let uploadUtils = require('../common/uploadUtils');
let router = express.Router();
let upload = uploadUtils.createUploadObject(['public','upload','bank']);

router.get('/chinaMapping', function (req, res, next) {
  let service = new commonService.commonInvoke('chinaMapping');
  let parameter = req.query.parentCode;

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
        chinaMapping: result.content.responseData
      });
    }
  });
});

router.get('/bankList', function (req, res, next) {
  let service = new commonService.commonInvoke('bank');
  let parameter = '1/999/N';

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
        bankList: result.content.responseData
      });
    }
  });
});

module.exports = router;
