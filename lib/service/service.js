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
service.draw = function(isMember, openId) {
    if (isMember) {
        var coupon  = data("coupon").findOneAndUpdate({
            type: "gold",
            status: "unused"
        }, {status: "sent", openId: openId});

        var bag  = data("coupon").findOneAndUpdate({
            type: "bag",
            status: "unused"
        }, {status: "sent", openId: openId});

        return Promise.all([coupon, bag]);
    } else {
        return data("coupon").findOneAndUpdate({
            type: "silver",
            status: "unused"
        }, {status: "sent", openId: openId});
    }
};

service.drawCount = function(openId) {
    return data("coupon").find({
        openId: openId
    });
};

service.countUser = function(openId) {
    return data("user").count({
        openId: openId
    });
};

service.exchangeCoupon = function(coupon, shop) {

    var getShop = data("shop").findOne({code: shop});
    var getCoupon = data("coupon").findOne({code: coupon, status: "sent"});

    return Promise.all([getShop, getCoupon]).then(function(promises) {
        var targetShop = promises[0];
        var targetCoupon = promises[1];

        if (!targetShop) {
            throw new Error("无效的店铺代码！");
        }

        if (!targetCoupon) {
            // throw new Error("无效的串码！");
            return "fail";
        }

        return data("exchange").count({
            shopCode: shop
        }).then(function(count) {
            if (count < targetShop.initNumber) {
                var addExchange = data("exchange").insert({
                    counponCode: coupon,
                    shopCode: shop
                });

                var decreaseRemaining = data("shop").findOneAndUpdate({code: shop}, {
                    $inc: {remainingNumber: -1}
                });

                var expireCoupon = data("coupon").findOneAndUpdate({code: coupon}, {
                    status: "used"
                });

                return Promise.all([addExchange, decreaseRemaining, expireCoupon]).then(function() {
                    return "ok";
                });
            } else {
                return "fail";
            }   
        });
    });
};

service.register = function(name, phone, personId, email) {
    return data("registry").insert({
        name: name,
        phone: phone,
        personId: personId,
        email: email
    });
};

