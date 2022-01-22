const { DataTypes } = require("sequelize");
const {sequelize}  = require('./sequelize.config')

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    progress: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'orders',
});

module.exports = {Order}