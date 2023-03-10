var express = require('express');
const { loginGet, loginPost, isLoggedIn, isLogged } = require('../controller/auth.controller');
var router = express.Router();

router.get('/', isLogged, loginGet);
router.post('/', loginPost);

module.exports = router;
