const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Purchase = sequelize.define('purchase', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATE, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    note: { type: DataTypes.STRING },
    reward: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = { Purchase };
