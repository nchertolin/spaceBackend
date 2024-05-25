const { Router } = require('express');
const controller = require('../controllers/purchaseController');

const router = new Router();

router.post('/purchases', controller.add);
router.get('/purchases', controller.getAll);

module.exports = router;
