let express = require('express');
let commonService = require('../service/commonService');
let dateTime = require("silly-datetime");
let dateUtil = require('date-utils');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('orderEdit', {title: '订单编辑', orderID: req.query.orderID});
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('order');
  let dt = new Date();
  let data = {
    bankCode: req.body.bankCode,
    branchCode: req.body.branchCode,
    orderDate: dt.toFormat('YYYY-MM-DD HH24:MI:SS'),
    orderType: req.body.orderType,
    originalAmount: req.body.originalAmount,
    discount: req.body.discount,
    orderAmount: req.body.orderAmount,
    serviceDueDate: Date.today().add({years: ~~req.body.serviceYear}).toFormat('YYYY-MM-DD 23:59:59'),
    orderStatus: 'W',
    orderItemList: req.body.orderItemList,
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

module.exports = router;
