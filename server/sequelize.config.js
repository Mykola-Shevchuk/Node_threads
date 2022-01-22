const {Sequelize} = require("sequelize");
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: '127.0.0.1',
    port: '5436',
    database: 'delivery',
    password: 'postgres',
    username: 'postgres',
});


module.exports = {sequelize};