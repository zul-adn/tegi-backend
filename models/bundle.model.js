const Sequelize = require("sequelize");
const dbConfig = require('./../config/config');


const sequelize = new Sequelize(
    dbConfig.DBNAME,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorAliases: false,
        port: dbConfig.DBPORT,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        },
        dialectOptions: {
            socketPath: dbConfig.HOST
        },
    }
)

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./users.model')(sequelize, Sequelize);

module.exports = db;