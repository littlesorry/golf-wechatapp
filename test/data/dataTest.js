var should = require("should");

var data = require(__dirname + "/../../lib/data/data");


describe("data.js", function() {

    before(function() {
        // data("shop")._clear();
    });



    // describe("#find@user", function() {
    //     it("should get no user", function(done) {
    //         data("user").find({"coupon.code": "code001"}).then(function(docs) {
    //             console.log(docs);
    //             done();
    //         });
    //     });
    // });

    // describe("#insert@user", function() {
    //     it("should insert user ok", function(done) {
    //         data("user").insert({
    //             openId: "open001",
    //             coupon: {
    //                 code: "code001"
    //             }
    //         }).then(function() {
    //             done();
    //         }).catch(function(err) {
    //             done(err);
    //         });
    //     });
    // });

    // describe("#findOne@user", function() {
    //     it("should get one user", function(done) {
    //         data("user").findOne({"coupon.code": "code001"}).then(function(doc) {
    //             doc.coupon.should.eql({
    //                 code: "code001"
    //             });
    //             done();
    //         });
    //     });
    // });

    // describe("#insert@coupon", function() {
    //     it("should insert coupon ok", function(done) {
    //         data("coupon").insert({
    //             code: "code001",
    //             status: "unused"
    //         }).then(function() {
    //             done();
    //         }).catch(function(err) {
    //             done(err);
    //         });
    //     });
    // });

    describe("#findOneAndUpdate@coupon", function() {
        it("should findOneAndUpdate one user", function(done) {
            // data("shop").findOne({"code": "test2"}).then(function(doc) {
            //     console.log(doc);
            //     doc.update({$dec: {remainingNumber: -1}});
            //     doc.save();
            //     done();
            // });
            data("shop").findOne({"code": "test2"}).then(function(doc) {
                console.log(doc);
                data("shop").findOneAndUpdate({"code": "test2"}, {$inc: {remainingNumber: -1}})
                .then(function(doc) {
                    console.log(doc);
                    done();
                });

                

                // doc.update({$dec: {remainingNumber: -1}});
                // doc.save();
            });        
        });
    });

    // describe("#find", function() {
    //     it("should get no target", function(done) {
    //         data("shop").find({"state": "北京", "city": "北京"}).then(function(docs) {
    //             docs.should.eql([]);
    //             done();
    //         });
    //     });        
    // });

    // describe("#findOne", function() {
    //     it("should get no target", function(done) {
    //         data("shop").findOne({"state": "北京", "city": "北京"}).then(function(doc) {
    //             done(doc);
    //         });
    //     });        
    // });

    // describe("#insert", function() {
    //     it("should succeed", function(done) {
    //         data("shop").insert({
    //             id: "id000",
    //             state: "北京",
    //             city: "北京",
    //             code: "aaa000"
    //         }).then(function() {
    //             done();
    //         }).catch(function(err) {
    //             done(err);
    //         });
    //     });     
    // });

    // describe("#find", function() {
    //     it("should get 1 target", function(done) {
    //         data("shop").find({"state": "北京", "city": "北京"}).then(function(docs) {
    //             console.log(docs);
    //             done();
    //         });
    //     });        
    // });

    // describe("#findOne", function() {
    //     it("should get 1 target", function(done) {
    //         data("shop").findOne({"state": "北京", "city": "北京"}).then(function(doc) {
    //             console.log(doc);
    //             done();
    //         });
    //     });        
    // });
})

