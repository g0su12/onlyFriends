const express = require('express');
const { loginGet, loginPost, isLogged } = require('../controller/auth.controller');

const router = express.Router();

router.get('/', isLogged, loginGet);
router.post('/', loginPost);

module.exports = router;
