const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      max: 50,
    },
    accountType: {
      type: String,
      enum: ["driver", "manager"],
      default: "driver",
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MapUsers", userSchema);
