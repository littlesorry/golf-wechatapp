var express = require('express');
var router = express.Router();

var service = require('../service/service');

router.get('/', function(req, res) {
    var isMember = req.query.isMember;
    var age = req.query.age;
    var openId = req.query.openId || req.session.openId;

    service
    .draw(isMember === 'true', age, openId)
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

router.get('/count', function(req, res) {
    service
    .drawCount(req.query.openId || req.session.openId)
    .then(function(coupons) {
        // change order if bag code at first
        coupons = coupons || [];
        (coupons.length > 0) && /^a/i.test(coupons[0].code) && (coupons = coupons.reverse());
        res.json({
            count: coupons.length,
            data: {
                coupon: coupons[0] && coupons[0].code,
                bag: coupons[1] && coupons[1].code
            }
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            status: "error"
        });
    });
});

module.exports = router;
