require("dotenv").config();

const trucksRoute = require("./routes/trucks");
const userRoute = require("./routes/users");

const morgan = require("morgan");
const cors = require("cors");

const express = require("express");
const app = express();
app.use(express.json());
app.use(morgan("common"));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content- Type, Accept");
  next();
});

app.use("/api/trucks", trucksRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.write("<h1>get your lame ass off here</h1>");
  res.end();
});

const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: true,
    credentials: true,
  },
  allowEIO3: true,
});
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connection established");
  })
  .catch((err) => console.log(err));

let users = [];
function addTruck(userId, socketId) {
  !users.some((truck) => truck.userId === userId) && users.push({ userId, socketId });
}
function removeTruck(socketId) {
  users = users.filter((truck) => truck.socketId !== socketId);
}

io.on("connection", (socket) => {
  console.log("connected to socket");

  socket.on("addUser", (user) => {
    addTruck(user, socket.id);
    io.emit("setOnlineUsers", users);
  });

  socket.on("updateCoord", ({ truckId, lat, long }) => {
    console.log("sent coordinates ", lat, long, " to ", truckId);
    io.emit("newCoord", { truckId, lat, long });
    io.emit("setOnlineUsers", users);
  });

  socket.on("deleteCoord", () => {
    console.log("refreshed");
    io.emit("setOnlineUsers", users);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeTruck(socket.id);
    io.emit("setOnlineUsers", users);
  });
});

http.listen(PORT, () => console.log("Server is running on port " + PORT));
