//import our db, Model, DataTypes
const { sequelize, DataTypes } = require('../db')

//Creating a User child class from the Model parent class
const User = sequelize.define("users", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
});

//exports
module.exports = { User }