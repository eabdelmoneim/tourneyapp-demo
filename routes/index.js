var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send('Slackbot is Alive!!!');
});

router.post('/hellobot', function(req,res,next){
	var userName = req.body.user_name;
	var botPayload = {
			text: 'Hello, ' + userName + '!'
	};
	
	if(userName !== 'slackbot') {
		return res.status(200).json(botPayload);
	} else {
		return res.status(200).end();
	}
})

module.exports = router;
