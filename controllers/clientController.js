const { Op } = require('sequelize');
const { Client, Purchase } = require('../models');
const ApiError = require('../error/ApiError');

const ERROR_MESSAGE = {
    NOT_FOUND: 'Client not found',
    CREATING: 'NotFound creating client',
    UPDATING: 'NotFound updating client',
};

const SUCCESS_MESSAGE = 'Success';

const ClientController = {
    async add(req, res, next) {
        try {
            const client = await Client.create(req.body);
            const { id, name, phone } = client;
            return res.json({ id, label: `${name}, ${phone}` });
        } catch (error) {
            return next(ApiError.internal());
        }
    },

    async getAllForSelect(req, res, next) {
        try {
            const clients = await Client.findAll({
                attributes: ['id', 'name', 'phone'],
            });

            if (!clients) {
                return next(ApiError.badRequest((ERROR_MESSAGE.NOT_FOUND)));
            }

            const modifiedClients = clients.map((client) => ({
                id: client.id,
                label: `${client.name}, ${client.phone}`,
            }));

            return res.json(modifiedClients);
        } catch (error) {
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
        const offset = page * limit - limit;

        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const clients = await Client.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: ['id', 'name', 'phone', 'description', 'bonuses'],
            include: [{
                model: Purchase,
                as: 'purchases',
                where: {
                    date: { [Op.between]: [startDate, endDate] },
                },
                attributes: ['id', 'date', 'name', 'reward', 'note'],
                order: [['date', 'DESC']],
                limit: 1,
                required: true,
            }],
        });

        return res.json(clients);
    },

    async getOne(req, res, next) {
        const { id } = req.params;
        const client = await Client.findOne(
            {
                where: { id },
                attributes: [
                    'id',
                    'name',
                    'phone',
                    'description',
                    'bonuses',
                ],
            },
        );
        if (!client) {
            return next(ApiError.badRequest((ERROR_MESSAGE.NOT_FOUND)));
        }
        const purchasesCount = await Purchase.count({ where: { clientId: id } });

        client.setDataValue('purchasesCount', purchasesCount);
        return res.json(client);
    },

    async updateOne(req, res, next) {
        const { id } = req.params;
        if (!id) {
            return next(ApiError.badRequest((ERROR_MESSAGE.NOT_FOUND)));
        }
        await Client.update(req.body, { where: { id } });
        return res.json(SUCCESS_MESSAGE);
    },

    async getAllPurchases(req, res, next) {
        const { search } = req.query;
        const { id } = req.params;

        if (!id) {
            return next(ApiError.badRequest((ERROR_MESSAGE.NOT_FOUND)));
        }

        let {
            limit, page, startDate, endDate,
        } = req.query;
        page = page || 1;
        limit = limit || 10;
        startDate = startDate || new Date('2024-01-01');
        endDate = endDate || Date.now();
        const offset = page * limit - limit;

        const whereClause = {
            clientId: id,
            date: { [Op.between]: [startDate, endDate] },
        };

        if (search) {
            whereClause[Op.or] = [
                {
                    name: { [Op.iLike]: `%${search}%` },
                },
            ];
        }

        const purchases = await Purchase.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: ['id', 'date', 'name', 'reward', 'note'],
            order: [['date', 'DESC']],
        });

        return res.json(purchases);
    },

    async stealBonuses(req, res, next) {
        try {
            const { id } = req.params;
            const client = await Client.findOne({ where: { id } });
            const currentBonuses = client.bonuses;
            const bonuses = Math.max(currentBonuses - req.body.bonuses, 0);
            await client.update({ bonuses });
            return res.json(client);
        } catch (error) {
            return next(ApiError.internal());
        }
    },
};

module.exports = ClientController;
