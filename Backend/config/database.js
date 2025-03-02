const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DB_URL)
        .then(() => { console.log("DB connect  ") })
        .catch((error) => { console.log(error) })
}