var crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes256';
var key = 'password';

module.exports = {
	getEncryptedText: function(binaryData) {
		var cipher = crypto.createCipher(algorithm, key);  
		var encrypted = cipher.update(binaryData, 'utf8', 'hex') + cipher.final('hex');
		return encrypted;
	},

	getDecryptedText: function(binaryData) {
		var decipher = crypto.createDecipher(algorithm, key);
		var decrypted = decipher.update(binaryData, 'hex', 'utf8') + decipher.final('utf8');
		return decrypted;
	}
};