let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('bankBranch');
  let pageNumber = req.query.pageNumber;
  let dataStatus = req.query.dataStatus;
  if(pageNumber === undefined){
    pageNumber = 1;
  }
  if(dataStatus === undefined){
    dataStatus = 'A';
  }

  service.getPageDataWithStatus(pageNumber, dataStatus, function (result) {
    let renderData = commonService.buildRenderData('支行管理', pageNumber, result);
    if(renderData.dataList !== null){
      for(let bank of renderData.dataList){
        if(bank.dataStatus === 'N'){
          bank.isNormal = true;
        }
        if(bank.dataStatus === 'F'){
          bank.isFrozen = true;
        }
        if(bank.dataStatus === 'D'){
          bank.isDelete = true;
        }
      }
    }

    renderData.dataStatus = dataStatus;
    res.render('bankBranch', renderData);
  });
});

router.put('/changeStatus', function (req, res, next) {
  let service = new commonService.commonInvoke('changeStatus4BankBranch');
  let data = {
    branchID: req.body.branchID,
    dataStatus: req.body.dataStatus,
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
