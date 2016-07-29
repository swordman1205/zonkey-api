module.exports = {
	getCurrentDate: function() {
		var date = new Date();

		return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	}
};