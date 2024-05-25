const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const defaultValue = {
    current: 1,
    increase: 1,
    percent: 1.0,
};

const Statistics = sequelize.define('statistics', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    purchasesCount: {
        type: DataTypes.JSONB,
        defaultValue,
    },
    bank: {
        type: DataTypes.JSONB,
        defaultValue,
    },
    bill: {
        type: DataTypes.JSONB,
        defaultValue,
    },
    profit: {
        type: DataTypes.JSONB,
        defaultValue,
    },
});

module.exports = { Statistics };
