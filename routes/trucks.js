require("dotenv").config();

const router = require("express").Router();
const axios = require("axios");

const Truck = require("../models/Trucks");
async function fetchLocationAddress(lat, long) {
  if (!lat || !long) return null;
  try {
    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${process.env.OPEN_CAGE_ACCESS_TOKEN}`
    );
    const data = res.data;
    if (data.status.code === 200) {
      const result = data.results.sort((a, b) => a.confidence - b.confidence);
      const city = result[0].components.county;
      const address = result[0].formatted;
      return { location: address, city: city };
    }
  } catch (err) {
    console.log(err.message);
  }
  return null;
}
// Create a pin
router.post("/", async (req, res) => {
  // check existing truck
  const findUser = await Truck.findOne({ userId: req.body.userId });
  if (findUser) {
    res.status(405).json("driver is taken");
    return;
  }
  const newTruck = new Truck(req.body);
  try {
    const savedTruck = await newTruck.save();
    res.status(201).json(savedTruck);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all pin
router.get("/", async (req, res) => {
  try {
    const pins = await Truck.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete truck
router.delete("/:truckId", async (req, res) => {
  try {
    await Truck.deleteOne({ _id: req.params.truckId });
    const trucks = await Truck.find();
    res.status(200).json(trucks);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// update location
router.put("/:truckId", async function (req, res) {
  let data;
  try {
    const address = await fetchLocationAddress(req.body.lat, req.body.long);
    if (address) {
      data = {
        ...req.body,
        ...address,
      };
    } else {
      data = { ...req.body };
    }
    const truck = await Truck.findByIdAndUpdate(req.params.truckId, { $set: data });
    res.status(200).json(truck);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
