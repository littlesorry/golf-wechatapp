var express = require('express');
var router = express.Router();

var service = require('../service/service');

router.get('/', function(req, res) {
    
    service
    .countUser(req.query.openId || req.session.openId)
    .then(function(count) {
        res.json({
            count: count
        });
    });
});

module.exports = router;
