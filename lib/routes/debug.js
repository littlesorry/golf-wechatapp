var express = require('express');
var router = express.Router();

var service = require('../service/service');

/* GET users listing. */
router.get('/', function(req, res) {
    if (req.query._token === "fagev5" && req.query._openId) {
        req.session.openId = req.query._openId
    }

	res.redirect("/entry");
});

module.exports = router;
