/**
 * Data model service for teams
 */

var teams = [ {
	id : 1,
	name : 'Chicago Bulls',
	channel : 'chicagobulls',
	wins : 0,
	losses : 0,
	followers : [ 1 ]
}, {
	id : 2,
	name : 'Indiana Pacers',
	channel : 'indianapacers',
	wins : 0,
	losses : 0,
	followers : [ 1 ]
} ];

var teamsService = {
	getAllTeams : function() {

		return teams;
	},

	getTeamWithId : function(id) {
		for (var i = 0; i < teams.length; i++) {
			var nextTeam = teams[i];

			if (nextTeam.id === id) {
				return nextTeam;
			}
		}

		return null;
	},

	getTeamWithName : function(name) {
		for (var i = 0; i < teams.length; i++) {
			var nextTeam = teams[i];

			if (nextTeam.name === name) {
				return nextTeam;
			}
		}

		return null;
	},

	getTeamForChannel : function(channelName) {
		for (var i = 0; i < teams.length; i++) {
			var nextTeam = teams[i];

			if (nextTeam.channel === channelName) {
				return nextTeam;
			}
		}

		return null;

	},

	addWinForTeam : function(id) {
		var myTeam = this.getTeamWithId(id);

		if (myTeam != null) {
			myTeam.wins++;
		}
	},

	addLossForTeam : function(id) {
		var myTeam = this.getTeamWithId(id);

		if (myTeam != null) {
			myTeam.losses++;
		}
	},

	addFollowerForTeam : function(id, newFollowerId) {
		var myTeam = this.getTeamWithId(id);

		if (myTeam != null) {
			myTeam.followers.push(newFollowerId);
		}
	}
};

module.exports = teamsService;
