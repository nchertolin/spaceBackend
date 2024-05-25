const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Service = sequelize.define('service', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = { Service };
