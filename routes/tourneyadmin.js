/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var User = require('../models/UserModel');
var Games = require('../models/GamesModel');
var Team = require('../models/TeamModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('hello from root of tourneyadmin route');
});

function parseMessage(msgText,matchLetter) {
	
	var re = new RegExp(matchLetter+':\\w+','i');

	var strArray = msgText.match(re);
	//console.log(strArray);
	if(strArray != null) {
		for(i=0; i<strArray.length; i++) {
			return strArray[i].substr(2);
		}
	}
	
	return null;
}

/*
 * POST receiving a game update
 * format: 'g:<id> h:<score> v:<score> p:<period>'
 */
router.post('/games', function(req, res, next) {
	var msgText = req.body.text;
	
	// get the game id
	var gameId = parseMessage(msgText,'g');
	if(gameId == null) {
		return res.status(200).json('no game id found - format g:<id> h:<home score> v:<visitor score> p:<period>');
	}
	
	// get the home score
	var homeScore = parseMessage(msgText,'h');
	if(homeScore == null){
		return res.status(200).json('no home score found - format g:<id> h:<home score> v:<visitor score> p:<period>');
	}
	
	// get the visitor score
	var visScore = parseMessage(msgText,'v');
	if(visScore == null){
		return res.status(200).json('no visitor score found - format g:<id> h:<home score> v:<visitor score> p:<period>');
	}
	
	// get the period
	var period = parseMessage(msgText,'p');
	if(period == null) {
		return res.status(200).json('no period found - format g:<id> h:<home score> v:<visitor score> p:<period>');
	}
	
	// update info on the game
	Games.setScoreForGame(gameId, homeScore, visScore);
	Games.setPeriodForGame(gameId, period);
	var theGame = Games.getGameWithId(gameId);
	if(theGame == null) {
		return res.status(200).json('Error - no game with ID ' + gameId + ' found');
	}
	
	// get Teams to find channels and send score update to respective channels
	var homeTeam = Team.getTeamWithId(theGame.homeId);
	var visTeam = Team.getTeamWithId(theGame.visitorId);
	var channels = [homeTeam.channel,visTeam.channel];
	var returnMsgText = 'Score Update: ' + homeTeam.name + ' ' + homeScore + ' ' + visTeam.name + ' ' + visScore + ' Period: ' + period;
	
	botPayload = {
			text: returnMsgText,
			channel: '#chicagobulls'
	};
	
	return res.status(200).json(botPayload);
	
	
});

module.exports = router;