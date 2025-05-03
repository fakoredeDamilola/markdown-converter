const mongoose = require("mongoose");

const db = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("database connected");
};

export default db;
