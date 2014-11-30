var util = require("util");

var DuplicateException = module.exports = function() {

};

util.inherits(DuplicateException, Error);