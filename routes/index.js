var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user: res.locals.currentUser});  

});

module.exports = router;
