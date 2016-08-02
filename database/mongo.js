var mongo = require('mongoskin');
var ObjectId  = mongo.ObjectId;
var config = require("../config/config.js");
var _ = require('lodash');
var util = require("../util/util.js");
var aes = require('../util/aes.js');

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
				callback(null, _.map(res, function(obj) {
					return _.pick(obj, ['_id', 'bc_number', 'latest_history']);
				}));
			} else {
				callback(null, null);
			}
		});
	},

	getDossier: function(dossierId, callback) {
		db.users.find({}).toArray(function(error, users) {
			if (error) {
				callback(error, null);
			}
			db.dossiers.findOne({ _id: ObjectId(dossierId) }, function(err, res) {
				if (err) {
					callback(err, null);
				}
				if (res) {
					db.histories.find({ dossier_id: ObjectId(res._id) }).sort({ create_at: -1 }).toArray(function(e, histories) {
						if (e) {
							callback(e, null);
						}
						res.users = _.map(users, function(usr) {
							return _.pick(usr, ['_id', 'name', 'avatar']);
						});
						res.histories = histories;
						if (histories) {
							db.comments.find({ dossier_id: ObjectId(res._id) }).toArray(function(e1, comments) {
								if (e1) {
									callback(e1, null);
								}
								res.comments = comments;
								if (comments) {
									db.attachments.find({ dossier_id: ObjectId(res._id) }).toArray(function(e2, attachments) {
										if (e2) {
											callback(e2, null);
										}
										if (attachments) {
											res.attachments = _.map(attachments, function(file) {
												/*var decryptedText = aes.getDecryptedText(file.file_data);
												file.file_data = decryptedText;
												return file;*/
												return {
													_id: file._id,
													user_id: file.user_id,
													dossier_id: file.dossier_id,
													file_name: file.file_name,
													file_type: file.file_type,
													category: file.category
												};
											});
											console.log('=====', res);
											callback(null, res);
										} else {
											res.attachments = null;
											callback(null, res);
										}
									});
								} else {
									callback(null, res);
								}
							});
						} else {
							callback(null, res);
						}
					});
				} else {
					callback(null, res);
				}
			});
		});
	},

	addComment: function(commentInfo, callback) {
		db.comments.insert({
			user_id: ObjectId(commentInfo.userId),
			dossier_id: ObjectId(commentInfo.dossierId),
			content: commentInfo.commentText,
			category: commentInfo.category,
			create_at: util.getCurrentDate()
		}, function(err, res) {
			if (err) {
				callback(err, null)
			}
			console.log('successfully saved!');
			var comment = res.ops[0];
			db.histories.insert({
				user_id: ObjectId(comment.user_id),
				dossier_id: ObjectId(comment.dossier_id),
				status: 3, // update with comment
				comment: ObjectId(comment._id),
				attachments: null,
				create_at: new Date()
			}, function(e, r) {
				if (e) {
					callback(e, null);
				}
				var history = r.ops[0];
				db.dossiers.update({ 
					_id: ObjectId(comment.dossier_id) 
				}, { 
					$set: { 
						latest_history: {
							user: commentInfo.userName,
							status: 3
						}
					} 
				}, function(e1, dossier) {
					if (e1) {
						callback(e1, null);
					}
					callback(null, {
						comment: comment,
						history: history
					});
				});
			})
		});
	},

	addFile: function(fileInfo, callback) {
		console.log(fileInfo);
		db.attachments.insert({
			user_id: ObjectId(fileInfo.userId),
			dossier_id: ObjectId(fileInfo.dossierId),
			file_data: aes.getEncryptedText(fileInfo.binaryData.toString('base64')),
			file_name: fileInfo.fileName,
			file_type: fileInfo.fileType,
			category: fileInfo.category,
			create_at: util.getCurrentDate()
		}, function(err, res) {
			if (err) {
				callback(err, null)
			}
			console.log('successfully saved!');
			var attachment = res.ops[0];
			db.histories.insert({
				user_id: ObjectId(attachment.user_id),
				dossier_id: ObjectId(attachment.dossier_id),
				status: 4, // update with attachment
				attachments: ObjectId(attachment._id),
				comment: null,
				create_at: new Date()
			}, function(e, r) {
				if (e) {
					callback(e, null);
				}
				var history = r.ops[0];
				db.dossiers.update({ 
					_id: ObjectId(attachment.dossier_id) 
				}, { 
					$set: { 
						latest_history: {
							user: fileInfo.userName,
							status: 4
						}
					} 
				}, function(e1, dossier) {
					if (e1) {
						callback(e1, null);
					}
					callback(null, true);
				});
			})
		});
	}
};