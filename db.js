var mongoose = require("mongoose");
const dbConnect = async () => {
  var conn = await mongoose.connect(process.env.MONGO_URI);
  console.log("DB connected");
};
module.exports = dbConnect;