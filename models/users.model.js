module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define('users',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,            
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
        },
        username: {
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        unique_id: {
            type: Sequelize.STRING,
        },
    })

    return users
}
