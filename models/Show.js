//import our db, Model, DataTypes
const { sequelize, DataTypes } = require('../db')

//Creating a User child class from the Model parent class
const Show = sequelize.define("shows", {
    title: DataTypes.STRING,
    genre: DataTypes.ENUM("Comedy", "Drama", "Horror", "Sitcom"),
    rating: DataTypes.INTEGER,
    status: DataTypes.STRING,
});

//exports
module.exports = { Show }
