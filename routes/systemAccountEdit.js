let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('systemAccountEdit', { title: '支行账号编辑', accountID: req.query.accountID });
});

router.get('/detail', function (req, res, next) {
  let service = new commonService.commonInvoke('systemAccount');
  let parameter = req.query.accountID + '/N';

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
        accountInfo: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('systemAccount');
  let data = {
    bankCode: req.body.bankCode,
    branchCode: req.body.branchCode,
    systemMultipleID: req.body.systemMultipleID,
    account: req.body.account,
    password: req.body.password,
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
  let service = new commonService.commonInvoke('systemAccount');
  let data = {
    accountID: req.body.accountID,
    account: req.body.account,
    password: req.body.password,
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