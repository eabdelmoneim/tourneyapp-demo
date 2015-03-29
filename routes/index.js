var express = require('express');
var router = express.Router();
var User = require('../public/javascripts/models/UserModel');
var Team = require('../public/javascripts/models/TeamModel');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.status(200).send('Slackbot is Alive!!!');
});

/* POST from slack - Hello */
router.post('/hellobot', function(req, res, next) {
	var userName = req.body.user_name;
	var botPayload = {
		text : 'Hello, ' + userName + '!'
	};

	if (userName !== 'slackbot') {
		return res.status(200).json(botPayload);
	} else {
		return res.status(200).end();
	}
});

/* POST from slack - follow */
router
		.post(
				'/follow',
				function(req, res, next) {
					var userName = req.body.user_name;
					var msgText = req.body.text;

					// find the team names using the @
					var teamNames = msgText.match(/@\w+/g);

					var botPayload = null;

					// if no team name found send instructions
					if (teamNames == null) {
						botPayload = {
							text : 'No team name for following was found in your message. To follow a team send \'follow @team\''
						};

						return res.status(200).json(botPayload);
					}

					for (teamIndex = 0; teamIndex < teamNames.length; teamIndex++) {
						teamNames[teamIndex] = teamNames[teamIndex].substr(1);
					}

					// if user doesn't exist create the new User
					var theUser = User.getUserWithUsername(userName);
					if (theUser == null) {
						User.addUser(userName);
						theUser = User.getUserWithUsername(userName);
					}

					var channelText = " ";
					// add the user as a follower to team
					for (i = 0; i < teamNames.length; i++) {
						var theTeam = Team.getTeamForChannel(teamNames[i]);
						
						if(theTeam != null) {
							Team.addFollowerForTeam(theTeam.id,theUser.id);
							channelText+='<#' + theTeam.channel + '> ';
						}
					}
					// send response to user with the #channel for the team
					botPayload = {
						text : '<@' + theUser.username + ' you are now subscribed. Receive updates for your team at '
								+ channelText
					};

					return res.status(200).json(botPayload);

				});

module.exports = router;
