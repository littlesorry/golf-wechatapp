var express = require('express');
var router = express.Router();

var service = require('../service/service');

router.get('/', function(req, res) {

    var couponCode = req.query.couponCode;
    var shopCode = req.query.shopCode;

    var openId = req.query.openId || req.session.openId;

    service
    .exchangeCoupon(req.query.couponCode, req.query.shopCode, openId)
    .then(function(result) {
        res.json({
            status: result
        });
    }).catch(function(err) {
        res.json({
            status: "error",
            err: err,
            message: err.message
        });
    });
});

module.exports = router;
