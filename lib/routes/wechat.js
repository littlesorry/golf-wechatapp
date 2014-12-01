var express = require('express');
var router = express.Router();
var config = require('config');
var request = require('request');
var handlebars = require('handlebars');

var service = require('../service/service');

var urlTpl = handlebars.compile(config.app.integration.wechatAccessTokenURL);
var userInfoUrlTpl = handlebars.compile(config.app.integration.wechatUserInfoURL);

router.get('/', function(req, res) {
    request(urlTpl({
        "appId": config.app.integration.wechatAppId,
        "secret": config.app.integration.wechatAppScret,
        "code": req.query.code
    }), function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("credential: " + body);
            
            var credential = JSON.parse(body);
            req.session.credential = credential;
            req.session.openId = credential.openid;

            request(userInfoUrlTpl({
                "token": credential.access_token,
                "openId": credential.openid
            }), function(error, response, body) {
                console.log("userInfo: " + body);
                if (!error && response.statusCode == 200) {
                    res.redirect('/entry');
                } else {
                    res.json(body);
                }
            });
        } else {
            res.json(body);
        }
    });
});

module.exports = router;
