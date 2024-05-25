const { Router } = require('express');
const controller = require('../controllers/userController');
const authHandler = require('../middleware/AuthMiddleware');

const router = new Router();

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.get('/auth', authHandler, controller.check);

module.exports = router;
