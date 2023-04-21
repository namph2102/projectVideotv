const mongoose = require("mongoose");
const ConnectDB = async () => {
  mongoose.connect(process.env.HOSTNAME);
};

module.exports = ConnectDB;
