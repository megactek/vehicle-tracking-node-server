require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
app.use(express.json());

const trucksRoute = require("./routes/trucks");
const userRoute = require("./routes/users");

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connection established");
  })
  .catch((err) => console.log(err));

app.use(morgan("common"));
app.use("/api/trucks", trucksRoute);
app.use("/api/users", userRoute);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
