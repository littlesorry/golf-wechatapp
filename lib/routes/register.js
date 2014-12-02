var express = require('express');
var router = express.Router();

var service = require('../service/service');

router.get('/', function(req, res) {

    service
    .register(req.query.name, req.query.phone, req.query.personId, req.query.email)
    .then(function() {
        res.json({
            status: "okay"
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
