const express = require("express");
const app = express();
const {sequelize} = require("./db");
const port = 3000;
const userRoutes = require("./routes/users")
const showRoutes = require("./routes/shows")

app.use("/users", userRoutes)
app.use("/shows", showRoutes)

app.listen(port, () => {
    sequelize.sync();
    console.log("Your server is listening on port " + port);
})