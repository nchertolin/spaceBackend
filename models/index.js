const { User } = require('./user');
const { Client } = require('./client');
const { Purchase } = require('./purchase');
const { Statistics } = require('./statistics');
const { Service } = require('./service');

Client.hasMany(Purchase, { as: 'purchases' });
Purchase.belongsTo(Client);

module.exports = {
    User,
    Statistics,
    Client,
    Purchase,
    Service,
};
