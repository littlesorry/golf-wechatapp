var express = require('express');
var router = express.Router();

var service = require('../service/service');

/* GET users listing. */
router.get('/', function(req, res) {
	// var url = '/?openId=' + (req.session.openId || "");

	// service
 //    	.getReferCount(req.session.openId)
 //    	.then(function(count) {
	// 		url += '&refers=' + count;
 //        	res.redirect(url);
 //    	});
	res.redirect("/index.html");
});

module.exports = router;
