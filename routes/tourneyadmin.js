/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var Slack = require('node-slackr');
var User = require('../models/UserModel');
var Games = require('../models/GamesModel');
var Team = require('../models/TeamModel');

// check for games that are starting
// if starting notify followers
function checkGamesStarting() {
	console.log(new Date(Date.now()) + ": checking for games that are starting");
	
	var gamesList = Games.getAllGames();
	
	for(i=0; i<gamesList.length; i++) {
		var nextGame = gamesList[i];
		var nextStartTime = Games.getStartTimeForGame(nextGame.id);
		var timeDiff = nextStartTime.getTime() - Date.now();
		console.log('game ' + nextGame.id + ': starts in ' + (Math.round(timeDiff/60000)) + ' minutes');
		
		// if the time difference is less than 15 minutes away
		// send msg to 
		if(timeDiff>0 && timeDiff<900000) {
			var homeTeam = Team.getTeamWithId(nextGame.homeId);
			var visTeam = Team.getTeamWithId(nextGame.visitorId);
			var channels = [homeTeam.channel,visTeam.channel];
			var returnMsgText = 'Next game starting in ' + (Math.round(timeDiff/60000)) + ' minutes: ' + homeTeam.name + ' vs. ' + visTeam.name + ' on court ' + nextGame.court;
			
			sendSlackMessageToChannel(returnMsgText, channels);
		}
	}
}

//initialize timer
var gameTimer = setInterval(checkGamesStarting, 600000);
console.log(new Date(Date.now()).toString() + ':initialzed game start timer');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('hello from root of tourneyadmin route');
});

/*
 * helper function to create JSON payload
 */
function createBotPayload(payloadText) {
	var botPayload = {
			text: payloadText
	};
	
	return botPayload;
}

/*
 * helper function that will parse out string tokens 
 * that come after '<matchletter>:'
 */
function parseMessage(msgText,matchLetter) {
	
	var re = new RegExp(matchLetter+':\\w+','i');

	var strArray = msgText.match(re);
	//console.log(strArray);
	if(strArray != null) {
		for(i=0; i<strArray.length; i++) {
			return strArray[i].substr(2).trim();
		}
	}
	
	return null;
}

/*
 * helper function for posting JSON to a channel
 */
function sendSlackMessageToChannel(msgText,channelName) {
	slack = new Slack('https://hooks.slack.com/services/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',{
		channel: channelName,
		username: 'tourney-app'
	});
	
	slack.notify(msgText);
	
}

/*
 * POST endpoint for receiving a game update
 * format: 'g:<id> h:<score> v:<score> p:<period>'
 */
router.post('/updatescore', function(req, res, next) {
	var msgText = req.body.text;
	
	// get the game id
	var gameId = parseMessage(msgText,'g');
	if(gameId == null) {
		return res.status(200).json(createBotPayload('no game id found - format score g:<id> h:<home score> v:<visitor score> p:<period>'));
	}
	
	// get the home score
	var homeScore = parseMessage(msgText,'h');
	if(homeScore == null){
		return res.status(200).json(createBotPayload('no home score found - format score g:<id> h:<home score> v:<visitor score> p:<period>'));
	}
	
	// get the visitor score
	var visScore = parseMessage(msgText,'v');
	if(visScore == null){
		return res.status(200).json(createBotPayload('no visitor score found - format score g:<id> h:<home score> v:<visitor score> p:<period>'));
	}
	
	// get the period
	var period = parseMessage(msgText,'p');
	if(period == null) {
		return res.status(200).json(createBotPayload('no period found - format score g:<id> h:<home score> v:<visitor score> p:<period>'));
	}
	
	var final = false;
	if(period == 'F') {
		final = true;
	}
	
	// update info on the game
	Games.setScoreForGame(gameId, homeScore, visScore);
	Games.setPeriodForGame(gameId, period);
	var theGame = Games.getGameWithId(gameId);
	if(theGame == null) {
		return res.status(200).json(createBotPayload('Error - no game with ID ' + gameId + ' found'))
	}
	
	// get Teams to find channels and send score update to respective channels
	var homeTeam = Team.getTeamWithId(theGame.homeId);
	var visTeam = Team.getTeamWithId(theGame.visitorId);
	var channels = [homeTeam.channel,visTeam.channel];
	var returnMsgText = 'Score Update: ' + homeTeam.name + ' ' + homeScore + ' ' + visTeam.name + ' ' + visScore + ' Period: ' + period;
	
	// if game has gone final, pre-pend FINAL to return msg and set period on game
	if(final) {
		returnMsgText = "FINAL ".concat(returnMsgText);
		Games.setPeriodForGame(gameId, "F");
	}
	
	sendSlackMessageToChannel(returnMsgText, channels);
	
	botPayload = {
			text: returnMsgText
	};
	
	return res.status(200).json(botPayload);
	
	
});

/*
 * POST endpoint for receiving notification that a game has started
 */
router.post('/startgame',function(req, res, next) {
	
	var msgText = req.body.text;
	
	// get the game id
	var gameId = parseMessage(msgText,'g');
	if(gameId == null) {
		return res.status(200).json(createBotPayload('no game id found - format start g:<id>'));
	}
	
	// find the game
	var theGame = Games.getGameWithId(gameId);
	if(theGame == null) {
		return res.status(200).json(createBotPayload('Error - no game with ID ' + gameId + ' found'));
	}
	
	// set period of game to 1st period
	Games.setPeriodForGame(gameId, "1");
	
	var homeTeam = Team.getTeamWithId(theGame.homeId);
	var visTeam = Team.getTeamWithId(theGame.visitorId);
	var channels = [homeTeam.channel,visTeam.channel];
	var returnMsgText = 'Game starting: ' + homeTeam.name + ' vs. ' + visTeam.name;
	
	// send message to individual team channels
	sendSlackMessageToChannel(returnMsgText, channels);
	
	var botPayload = {
			text: returnMsgText
	};
	
	return res.status(200).json(botPayload);
	
});

/*
 * POST request to get a score update for a specific game
 * FORMAT: score g:<game id>
 */
router.post('/getscore', function(req, res, next) {
	
	var msgText = req.body.text;
	
	// get the game id
	var gameId = parseMessage(msgText,'g');
	if(gameId == null) {
		return res.status(200).json(createBotPayload('no game with id found - format score g:<id>'));
	}
	
	// find the game
	var theGame = Games.getGameWithId(gameId);
	if(theGame == null) {
		return res.status(200).json(createBotPayload('Error - no game with ID ' + gameId + ' found'));
	}
	
	// if game hasn't started send message that game hasn't started
	if(theGame.period == '0') {
		return res.status(200).json(createBotPayload('Game has not started - game scheduled for ' + Games.getStartTimeForGame(gameId).toString() + " on court " + theGame.court));
	}
	
	// get Teams to find channels and send score update to respective channels
	var homeTeam = Team.getTeamWithId(theGame.homeId);
	var visTeam = Team.getTeamWithId(theGame.visitorId);
	var channels = [homeTeam.channel,visTeam.channel];
	var returnMsgText = 'Score Update: ' + homeTeam.name + ' ' + theGame.homescore + ' ' + visTeam.name + ' ' + theGame.visitorscore + ' Period: ' + theGame.period;
	
	// send message to individual team channels
	sendSlackMessageToChannel(returnMsgText, channels);
	
	var botPayload = {
			text: returnMsgText
	};
	
	return res.status(200).json(botPayload);
});

module.exports = router;