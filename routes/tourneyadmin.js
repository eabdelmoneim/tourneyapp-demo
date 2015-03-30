/**
 * New node file
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('hello from root of tourneyadmin route');
});

module.exports = router;