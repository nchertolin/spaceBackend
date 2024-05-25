const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Client = sequelize.define('client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    bonuses: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = { Client };
