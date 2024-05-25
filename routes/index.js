const { Router } = require('express');
const userRouter = require('./user');
const statisticsRouter = require('./statistics');
const salesRouter = require('./purchases');
const clientsRouter = require('./clients');
const servicesRouter = require('./services');
const authHandler = require('../middleware/AuthMiddleware');

const router = new Router();

router.use(userRouter);

router.use(authHandler);
router.use(statisticsRouter);
router.use(salesRouter);
router.use(clientsRouter);
router.use(servicesRouter);

module.exports = router;
