require('dotenv').config();

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DBNAME: process.env.DB_NAME,
    DBPORT: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

// ============ development

// module.exports = {
//     HOST: '127.0.0.1',
//     USER: 'root',
//     PASSWORD: 'root',
//     DBNAME: 'tegiai',
//     dialect: 'mysql',
//     DBPORT: 8889,
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// }