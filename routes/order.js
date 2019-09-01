let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('order');
  let pageNumber = req.query.pageNumber;
  let dataStatus = req.query.dataStatus;
  if(pageNumber === undefined){
    pageNumber = 1;
  }
  if(dataStatus === undefined){
    dataStatus = 'A';
  }

  service.getPageDataWithStatus(pageNumber, dataStatus, function (result) {
    let renderData = commonService.buildRenderData('订单管理', pageNumber, result);
    if(renderData.dataList !== null){
      for(let order of renderData.dataList){
        order.orderAmount = order.orderAmount.toFixed(2);
        if(order.orderStatus === 'W'){
          order.isWait = true;
        }
        if(order.orderStatus === 'N'){
          order.isNoraml = true;
        }
        if(order.orderStatus === 'E'){
          order.isExpired = true;
        }
      }
    }

    renderData.orderStatus = dataStatus;
    res.render('order', renderData);
  });
});

router.put('/changeStatus', function (req, res, next) {
  let service = new commonService.commonInvoke('changeStatus4Order');
  let data = {
    orderID: req.body.orderID,
    orderStatus: req.body.orderStatus,
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
