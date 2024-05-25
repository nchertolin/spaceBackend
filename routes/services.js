const { Router } = require('express');
const controller = require('../controllers/serviceController');

const router = new Router();

router.post('/services', controller.add);
router.get('/services', controller.getAll);

module.exports = router;
