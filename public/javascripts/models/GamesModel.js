/**
 * Data model service for games
 */

var games = [ {
	id : 1,
	homeId : 1,
	visitorId : 2,
	period : 'Not Started',
	homescore : 0,
	visitorscore : 0
// start time?
} ];

	function getGame(id) {
		for(var i=0; i<games.length; i++) {
			var nextGame = games[i];
			if(games[i].id === id) {
				return games[i];
			}
		}
		
		return null;
	}
	
	function setScoreForGame(id, homeScore, visitorScore) {
		var game = getGame(id);
		
		if(game != null) {
			game.homescore = homeScore;
			game.visitorscore = visitorScore;
		}
	}
	
	function setPeriodForGame(id, period) {
		var game = getGame(id);
		
		if(game != null) {
			game.period = period;
		}
	}
	
	