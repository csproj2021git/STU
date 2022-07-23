const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

module.exports.User = require('./user')
module.exports.Env = require('./Env')