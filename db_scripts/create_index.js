db.coupons.ensureIndex( { "openId": 1}, { unique: true, sparse: true } );
db.coupons.ensureIndex( { "type": 1, "statues": 1 });
