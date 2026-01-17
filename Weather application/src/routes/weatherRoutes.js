const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getWeather } = require('../controllers/weatherController');

router.get('/', auth, getWeather);

module.exports = router;
