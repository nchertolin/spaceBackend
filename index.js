require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const router = require('./routes/index');
const sequelize = require('./db');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const StatisticsController = require('./controllers/statisticsController');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use((req, res, next) => {
    // allow access to current url. work for https as well
    res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
    res.removeHeader('x-powered-by');
    // allow access to current method
    res.setHeader('Access-Control-Allow-Methods', req.method);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(express.json());
app.use('/api', router);

app.use(errorHandler);

cron.schedule('0 0 0 1 */2 *', async () => {
    try {
        await StatisticsController.update();
        console.info('Statistics successful updated');
    } catch (e) {
        console.error('Statistics update error');
    }
}, {
    scheduled: true,
    timezone: 'Asia/Yekaterinburg',
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on ${PORT}`));
    } catch (e) {
        console.error(e);
    }
};

start();
