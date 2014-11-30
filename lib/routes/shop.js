var express = require('express');
var router = express.Router();

var service = require('../service/service');

/* GET users listing. */
router.get('/', function(req, res) {
    service
    .getShop(req.query.state, req.query.city)
    .then(function(shops) {
        res.json({
            status: "ok",
            data: shops
        });
    }).catch(function(err) {
        res.json({
            status: "error",
            err: err
        });
    });
});

module.exports = router;
