const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Trucks = require("../models/Trucks");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      accountType: req.body.accountType,
    });
    const user = await newUser.save();
    res.status(201).json(user._id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    // find user
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(403).json({ message: "wrong email or password" });

    // validate password

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    !validPassword && res.status(403).json({ message: "wrong email or password" });
    return res.status(200).json(user);
    // send res
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// get all drivers
router.get("/drivers", async function (req, res) {
  try {
    const drivers = await User.find({ accountType: "driver" });
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
