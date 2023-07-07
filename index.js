require("dotenv").config();

const trucksRoute = require("./routes/trucks");
const userRoute = require("./routes/users");

const morgan = require("morgan");

const express = require("express");
const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use("/api/trucks", trucksRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.write("<h1>get your lame ass off here</h1>");
  res.end();
});

const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:3000", "https://vehicle-tracking-react-app.vercel.app/", "http://127.0.0.1:3000"],
  },
});
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connection established");
  })
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("connected to socket");

  socket.on("updateCoord", ({ truckId, lat, long }) => {
    console.log("sent coordinates ", lat, long, " to ", truckId);
    io.emit("newCoord", { truckId, lat, long });
    io.emit("refreshCoord", {});
  });

  socket.on("deleteCoord", () => {
    console.log("refreshed");
    io.emit("refreshCoord", {});
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

http.listen(PORT, () => console.log("Server is running on port " + PORT));
