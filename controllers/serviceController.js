const { Op } = require('sequelize');
const { Service } = require('../models');
const ApiError = require('../error/ApiError');

const ServiceController = {
    async add(req, res, next) {
        const { name } = req.body;

        if (!name) {
            return next(ApiError.badRequest(('Name not specified')));
        }

        try {
            const service = Service.create(req.body);
            return res.json(service.name);
        } catch (e) {
            return next(ApiError.internal());
        }
    },

    async getAll(req, res) {
        const services = await Service.findAll({
            order: [['name', 'ASC']],
            attributes: ['name'],
        });
        const names = services.map((service) => service.name);
        return res.json(names);
    },
};

module.exports = ServiceController;
