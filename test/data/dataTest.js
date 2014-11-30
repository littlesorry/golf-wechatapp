var should = require("should");

var data = require(__dirname + "/../../lib/data/data");


describe("data.js", function() {

    before(function() {
        // data("shop")._clear();
    });

    describe("#find", function() {
        it("should get no target", function(done) {
            data("shop").find({"state": "北京", "city": "北京"}).then(function(docs) {
                docs.should.eql([]);
                done();
            });
        });        
    });

    describe("#findOne", function() {
        it("should get no target", function(done) {
            data("shop").findOne({"state": "北京", "city": "北京"}).then(function(doc) {
                done(doc);
            });
        });        
    });

    describe("#insert", function() {
        it("should succeed", function(done) {
            data("shop").insert({
                id: "id000",
                state: "北京",
                city: "北京",
                code: "aaa000"
            }).then(function() {
                done();
            }).catch(function(err) {
                done(err);
            });
        });     
    });

    describe("#find", function() {
        it("should get 1 target", function(done) {
            data("shop").find({"state": "北京", "city": "北京"}).then(function(docs) {
                console.log(docs);
                done();
            });
        });        
    });

    describe("#findOne", function() {
        it("should get 1 target", function(done) {
            data("shop").findOne({"state": "北京", "city": "北京"}).then(function(doc) {
                console.log(doc);
                done();
            });
        });        
    });
})

