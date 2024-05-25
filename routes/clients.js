const { Router } = require('express');
const controller = require('../controllers/clientController');

const router = new Router();

router.post('/clients', controller.add);

router.get('/clients', controller.getAll);
router.get('/clients/select', controller.getAllForSelect);
router.get('/clients/:id', controller.getOne);
router.get('/clients/:id/purchases', controller.getAllPurchases);

router.put('/clients/:id', controller.updateOne);

router.patch('/clients/:id/steal', controller.stealBonuses);

module.exports = router;
