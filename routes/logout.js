var express = require('express');
const { logOut } = require('../controller/auth.controller');
var router = express.Router();

router.get('/', logOut);

module.exports = router;