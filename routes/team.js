/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var Slack = require('node-slackr');
var User = require('../models/UserModel');
var Games = require('../models/GamesModel');
var Team = require('../models/TeamModel');

/* GET game listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('hello from root of game route');
});

module.exports = router;