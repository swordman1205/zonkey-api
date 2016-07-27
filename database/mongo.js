var mongo = require('mongoskin');
var ObjectId  = mongo.ObjectId;
var config = require("../config/config.js");
var _ = require('lodash');

var db = mongo.db(process.env.MONGOLAB_URI || config.mLab, {native_parser:true});
//var db = mongo.db('mongodb://localhost:27017/zonkey', {native_parser:true});
db.bind('users');
db.bind('dossiers');
db.bind('histories');
db.bind('comments');
db.bind('attachments');
db.bind('companies');

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
	},

	getDossiers: function(callback) {
		db.dossiers.find({}).toArray(function(err, res) {
			if (err) {
				callback(err, null);
			}
			if (res) {
				console.log(res);
				var result = _.map(res, function(obj) {
					var history_id = obj.latest_history;
					console.log(history_id.toString());
					console.log(history_id + "");
					console.log(ObjectId(history_id.toString()));
					console.log(ObjectId(history_id+""));
					db.histories.findOne({ _id: ObjectId(history_id.toString()) }, function(e, r) {
						if (e) {
							console.log(e);
							callback(e, null);
						}
						console.log(r);
						obj.latest_history = r;
						return obj;
					});
				});
				console.log(result);
				callback(null, result);
			} else {
				callback(null, null);
			}
		});
	}
};