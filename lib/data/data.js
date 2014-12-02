var config = require('config');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var DuplicateException = require('./exception/duplicateException');

var dataConfig = config.get('data');

var db = mongoose.connect(dataConfig.db.url);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('connected', function() {
    console.info('mongodb ready');
});

var modelPool = {};
for(var model in dataConfig.models) {
    var access = modelPool[model] = db.model(model, dataConfig.models[model]);

    access.promiseCalls = {
        "count": Promise.promisify(access.count, access),
        "find": Promise.promisify(access.find, access),
        "findOne": Promise.promisify(access.findOne, access),
        "findOneAndUpdate": Promise.promisify(access.findOneAndUpdate, access),
        "insert": Promise.promisify(access.create, access),
        "remove": Promise.promisify(access.remove, access),
        "update": Promise.promisify(access.update, access)
    };
}

for(var idx in dataConfig.extends) {
    var modelName = dataConfig.extends[idx];
    require('./ext/' + dataConfig.extends[idx]).extend(modelPool[dataConfig.extends[idx]]);
}

var data = module.exports = function(type) {
    var Model = modelPool[type];
    return {
        "_model": Model,
        count: function(criteria) {
            return Model.promiseCalls.count(criteria);
        },
        find: function(criteria) {
            return Model.promiseCalls.find(criteria);
        },
        findOne: function(criteria) {
            return Model.promiseCalls.findOne(criteria);
        },
        findOneAndUpdate: function(criteria, update) {
            return Model.promiseCalls.findOneAndUpdate(criteria, update);
        },
        findAndModify: function(criteria, update) {
            return Model.promiseCalls.findAndModify(criteria, update);
        },
        insert: function(data) {
            return Model.promiseCalls
                    .insert(data)
                    .catch(function(err) {
                        if (err.cause && err.cause.code === 11000) {
                            throw new DuplicateException();
                        }
                        throw err;
                    });
        },
        update: function(criteria, update) {
            return Model.promiseCalls.findOneAndUpdate(criteria, update);
        },
        _clear: function() {
            return Model.promiseCalls.remove({});
        }
    };
};

