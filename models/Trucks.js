const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    vehicleId: {
      type: String,
    },
    desc: {
      type: String,
      required: true,
      min: 3,
    },
    location: { type: String },
    city: { type: String },
    lat: {
      type: Number,
      require: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trucks", truckSchema);
