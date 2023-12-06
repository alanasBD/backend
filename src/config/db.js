const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDB = async (options={}) => {
  try {
    await mongoose.connect(mongodbURL,options);
    console.log("connected");
    mongoose.connection.on("error", (error) => {
      console.error(error);
    });
  } catch (error) {
    console.error("Failed", error.toString());
  }
};

module.exports = connectDB;
