/**
 * 
 * Data model service for user/subscriber
 * 
 */

var users = [ {
	id : '1',
	username : 'yousuf'
// phonenumber : '6309155988'
} ];

var usersService = {
	getUsers : function() {
		return users;
	},

	addUser : function(userName) {
		var topId = users.length + 1;

		users.push({
			id : topId,
			username : userName
		});
	},

	removeUser : function(id) {

		for (var i = 0; i < users.length; i++) {
			var nextUser = users[i];
			if (nextUser.id === id) {
				users.splice(i, 1);
			}
		}
	},

	getUserWithId : function(id) {

		for (var i = 0; i < users.length; i++) {
			var nextUser = users[i];
			if (nextUser.id === id) {
				return users[i];
			}
			;
		}
		;

		return null;
	},

	getUserWithUsername : function(userName) {

		for (var i = 0; i < users.length; i++) {
			var nextUser = users[i];
			if (nextUser.username === userName) {
				return users[i];
			}
			;
		}
		;

		return null;
	}

};

module.exports = usersService;