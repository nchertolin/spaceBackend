const { Router } = require('express');
const controller = require('../controllers/statisticsController');

const router = new Router();

router.get('/statistics', controller.get);
router.get('/statistics/update', controller.update);

module.exports = router;
