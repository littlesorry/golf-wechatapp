var Promise = require("bluebird");

var data = require("../data/data");
var DuplicateException = require('../data/exception/duplicateException');


var service = module.exports = {

};

service.getShop = function(state, city) {
    return data("shop").find({
        "state": state,
        "city": city
    });
};

// TODO:
service.draw = function(isMember) {
    if (isMember) {
        var coupon  = data("coupon").findOneAndUpdate({
            type: "gold",
            status: "unused"
        }, {status: "sent"});

        var bag  = data("coupon").findOneAndUpdate({
            type: "bag",
            status: "unused"
        }, {status: "sent"});

        return Promise.all([coupon, bag]);
    } else {
        return data("coupon").findOneAndUpdate({
            type: "silver",
            status: "unused"
        }, {status: "sent"});
    }
};

service.countUser = function(openId) {
    return data("user").count({
        openId: openId
    });
};
