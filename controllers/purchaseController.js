const { Op } = require('sequelize');
const { Purchase, Client } = require('../models');
const ApiError = require('../error/ApiError');

const PurchaseController = {
    async add(req, res, next) {
        const {
            name, date, reward, clientId,
        } = req.body;

        if (!name) {
            return next(ApiError.badRequest(('Name not specified')));
        }

        if (!date) {
            return next(ApiError.badRequest(('Date not specified')));
        }

        if (!reward) {
            return next(ApiError.badRequest(('Reward not specified')));
        }

        try {
            const purchase = await Purchase.create(req.body);
            const client = await Client.findOne({ where: { id: clientId } });
            if (client) {
                const bonuses = Math.floor(client.bonuses + 0.1 * reward);
                await Client.update({ bonuses }, { where: { id: clientId } });
                return res.json(purchase);
            }
            return next(ApiError.badRequest(('Client not found')));
        } catch (e) {
            return next(ApiError.internal());
        }
    },

    async getAll(req, res) {
        const { search } = req.query;
        let {
            limit, page, startDate, endDate,
        } = req.query;
        page = page || 1;
        limit = limit || 10;
        startDate = startDate || new Date('2024-01-01');
        endDate = endDate || Date.now();

        const whereClause = {
            date: { [Op.between]: [startDate, endDate] },
        };

        const clientWhereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
            ];
            clientWhereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const offset = page * limit - limit;
        const purchases = await Purchase.findAndCountAll({
            where: whereClause,
            order: [['date', 'DESC']],
            limit,
            offset,
            attributes: ['id', 'date', 'name', 'reward', 'note'],
            include: [{
                model: Client,
                where: clientWhereClause,
                attributes: ['id', 'name', 'phone'],
                required: false,
            }],
        });
        return res.json(purchases);
    },
};

module.exports = PurchaseController;
