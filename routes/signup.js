var express = require('express');
const { signUpGet, signUpPost, isLogged } = require('../controller/auth.controller');
var router = express.Router();

router.get('/',isLogged, signUpGet);
router.post('/', signUpPost);

module.exports = router;
