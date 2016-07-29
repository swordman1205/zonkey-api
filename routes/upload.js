var mongo = require('../database/mongo.js');
var _ = require('lodash');

var upload = {
	addNew: function(req, res) {
		console.log(req.body);
	}
};

module.exports = upload;