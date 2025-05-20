const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware')
const { register, login } = require('../controllers/authController');
const { buyCrypto, sellCrypto, getPortfolio } = require('../controllers/coinGeckoController');

router.post('/register', register);
router.post('/login', login);

router.post('/buy', authenticate, buyCrypto);
router.post('/sell', authenticate, sellCrypto);
router.get('/summary', authenticate, getPortfolio);


module.exports = router;
