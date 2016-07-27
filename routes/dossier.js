var mongo = require('../database/mongo.js');
var _ = require('lodash');

var dossier = {
	getAll: function(req, res) {
		res.send("this is a dossier router!");
		/*mongo.getDossiers(function(e, r) {
			if (e) {
				res.send(JSON.stringify(e.message));
			} else {
		        if (r) {
		          res.send(JSON.stringify(r));
		        } else {
		          res.send(r);
		        }
		    }
		});*/
	}
};