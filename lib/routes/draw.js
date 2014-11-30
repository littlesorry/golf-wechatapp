var express = require('express');
var router = express.Router();

var service = require('../service/service');

router.get('/', function(req, res) {
    var isMember = req.query.isMember;

    service
    .draw(isMember === 'true')
    .then(function(coupons) {
    	if(coupons.type === 'silver') {
    		res.json({
    			status: "ok",
    			type: 'silver',
    			data: {
    				coupon: coupons.code
    			}
    		});
    	} else {
    		res.json({
    			status: "ok",
    			type: "gold",
    			data: {
    				coupon: coupons[0].code,
    				bag: coupons[1].code
    			}
    		});
    	}
    }).catch(function(err) {
    	res.json({
    		status: "fail"
    	});
    });

});

module.exports = router;