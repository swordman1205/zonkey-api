var mongo = require('mongoskin');
var ObjectId  = mongo.ObjectId;
var config = require("../config/config.js");
var _ = require('lodash');

var db = mongo.db(process.env.MONGOLAB_URI || config.mLab, {native_parser:true});
//var db = mongo.db('mongodb://localhost:27017/zonkey', {native_parser:true});
db.bind('users');

// check if email already exists as other social account
module.exports = {
	login: function(userInfo, callback) {
		db.users.findOne({
			username: userInfo.username,
			password: userInfo.password
		}, function(err, res) {
		    if (err) {
		    	callback(err, null);
		    }
		    if (res) {
		    	callback(null, res);
		    } else {
		    	callback(null, null);
		    }
		});
	}
};