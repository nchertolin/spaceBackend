const { Op } = require('sequelize');
const { Statistics, Purchase } = require('../models');
const ApiError = require('../error/ApiError');
const getUpdated = require('../lib/helpers/updateStatistics');
const getDateInterval = require('../lib/helpers/getDateInterval');

const PROFIT_FACTOR = 0.6;

const StatisticsController = {
    async get(req, res, next) {
        try {
            const statistics = await Statistics.findByPk(1);
            return res.json(statistics);
        } catch (e) {
            return next(ApiError.internal());
        }
    },

    async update(req, res) {
        const { count, rows } = await Purchase.findAndCountAll({
            where: { date: { [Op.between]: getDateInterval() } },
        });
        const prev = await Statistics.findByPk(1);
        const totalReward = rows.reduce((total, purchase) => total + purchase.reward, 0);
        const currentBill = count ? Math.round(totalReward / count) : 0;
        const currentProfit = Math.round(totalReward * PROFIT_FACTOR);

        await Statistics.update(getUpdated({
            purchasesCount: prev.purchasesCount.current,
            bank: prev.bank.current,
            bill: prev.bill.current,
            profit: prev.profit.current,
        }, {
            purchasesCount: count,
            bank: totalReward,
            bill: currentBill,
            profit: currentProfit,
        }), { where: { id: 1 } });

        const stat = await Statistics.findByPk(1);
        res.json(stat);
    },

};

module.exports = StatisticsController;
