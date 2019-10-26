let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('bankBranchEdit', { title: '支行信息编辑', bankBranchID: req.query.bankBranchID });
});

router.get('/branchCode/exist', function (req, res, next) {
  let service = new commonService.commonInvoke('bankBranchCodeExist');
  let branchCode = req.query.branchCode;

  service.get(branchCode, function (result) {
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
  let service = new commonService.commonInvoke('bankBranch');
  let parameter = req.query.branchID + '/N';

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
        branchInfo: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('bankBranch');
  let data = {
    bankCode: req.body.bankCode,
    branchCode: req.body.branchCode,
    branchName: req.body.branchName,
    provinceCode: req.body.provinceCode,
    cityCode: req.body.cityCode,
    districtCode: req.body.districtCode,
    address: req.body.address,
    branchLogo: req.body.branchLogo,
    branchContact: req.body.branchContact,
    branchContactCellphone: req.body.branchContactCellphone,
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
  let service = new commonService.commonInvoke('bankBranch');
  let data = {
    branchID: req.body.bankBranchID,
    bankCode: req.body.bankCode,
    branchCode: req.body.branchCode,
    branchName: req.body.branchName,
    provinceCode: req.body.provinceCode,
    cityCode: req.body.cityCode,
    districtCode: req.body.districtCode,
    address: req.body.address,
    branchLogo: req.body.branchLogo,
    branchContact: req.body.branchContact,
    branchContactCellphone: req.body.branchContactCellphone,
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
