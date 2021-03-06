var mongo = require('../database/mongo.js');
var _ = require('lodash');

var upload = {
	addNew: function(req, res) {

		mongo.addFile({
			userId: req.body.userId,
			category: req.body.category,
			dossierId: req.body.dossierId,
			userName: req.body.userName,
			binaryData: req.files.files.data,
			fileName: req.files.files.name,
			fileType: req.files.files.mimetype
		}, function(err, comment) {
			if (err) {
				res.send(err.message);
			}
			if (comment) {
				res.send(JSON.stringify(comment));
			} else {
				res.send(null);
			}
		});
	}
};

module.exports = upload;