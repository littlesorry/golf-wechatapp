var Promise = require('bluebird');

var coupon = module.exports = {
	extend: function (couponModel) {
		couponModel.schema.statics.findAndModify = function(query, doc, callback) {
			return this.collection.findAndModify(query, null, doc, null, callback);
		};

		couponModel.promiseCalls.findAndModify = Promise.promisify(couponModel.schema.statics.findAndModify, couponModel);
	}
};