const router = require("express").Router();

const Truck = require("../models/Trucks");

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
  try {
    const truck = await Truck.findByIdAndUpdate(req.params.truckId, { $set: req.body });
    res.status(200).json(truck);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
