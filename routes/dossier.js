var mongo = require('../database/mongo.js');
var _ = require('lodash');

var dossier = {
	getAll: function(req, res) {
		mongo.getDossiers(function(e, r) {
			if (e) {
				res.send(JSON.stringify(e.message));
			} else {
		        if (r) {
		          res.send(JSON.stringify(r));
		        } else {
		          res.send(r);
		        }
		    }
		});
	},

	getById: function(req, res) {
		mongo.getDossier(req.query.id, function(e, r) {
			if (e) {
				res.send(JSON.stringify(e.message));
			}
			res.send(JSON.stringify(r));
		});
	}
};

module.exports = dossier;