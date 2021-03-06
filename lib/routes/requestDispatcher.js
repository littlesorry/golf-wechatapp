var express = require('express');

var requestDispatcher = module.exports = function(app) {
    var route = express.Router();

    // wechat entry does not need login check
    route.use('/wechat', require('./wechat'));

    route.use('/register', require('./register'));

    route.use('/debug', require('./debug'));

    // wechat session login check
    route.use(require('../middleware/wechatMiddleware'));

    route.use('/entry', require('./entry'));
    route.use('/shop', require('./shop'));
    route.use('/draw', require('./draw'));
    route.use('/user', require('./user'));

    // exchange needs login
    route.use('/exchange', require('./exchange'));

    // catch 404 and forward to error handler
    route.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(route);
};
