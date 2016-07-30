var mongo = require('../database/mongo.js');
var _ = require('lodash');

var comment = {
	addNew: function(req, res) {

		mongo.addComment(req.body, function(err, comment) {
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

module.exports = comment;