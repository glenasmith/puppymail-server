var express = require('express');
var request = require('request');
var router = express.Router();
var Pocket = require('getpocket')

// https://www.npmjs.com/package/getpocket

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/pocket/request', function(req, res, next) {

  pocket = new Pocket('your-api-key-might-go-here', 'http://localhost:3000/pocket/callback');

  pocket.authorizeRoute(req, res)
});

router.get('/pocket/callback', (req,res) =>
  	pocket.getAccessToken(req.query.code, (err, r) =>
  		res.json(r)
  	)
  );

module.exports = router;
