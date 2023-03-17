const express = require('express');
const { logOut } = require('../controller/auth.controller');

const router = express.Router();

router.get('/', logOut);

module.exports = router;
