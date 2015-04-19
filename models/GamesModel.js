/**
 * Data model service for games
 */

var games = [ {
	id : '1',
	homeId : '1',
	visitorId : '2',
	period : '0',
	homescore : '0',
	visitorscore : '0',
	court: "A"
   // start time?
} ];

// hard coded to 30 minutes from now
var startTime = new Date(Date.now() + 30*60000);

//console.log("start time has been set: " + startTime);

function getGame(id) {
	
	for (var i = 0; i < games.length; i++) {
		var nextGame = games[i];
		if (games[i].id === id) {
			return games[i];
		}
	}

	return null;
}
var gamesService = {

	getGameWithId : function(id) {

		return getGame(id);
	},

	setScoreForGame : function(id, homeScore, visitorScore) {
		var game = getGame(id);

		if (game != null) {
			game.homescore = homeScore;
			game.visitorscore = visitorScore;
		}
	},

	setPeriodForGame : function(id, period) {
		var game = getGame(id);

		if (game != null) {
			game.period = period;
		}
	},
	
	getStartTimeForGame : function(id) {
		return startTime;
	},
	
	getAllGames : function() {
		return games;
	}

};

module.exports = gamesService;