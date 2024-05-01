import { Flight } from "./types";
import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { generateFlightNumber } from "./utils";
import { airports } from "./airportList";
import moment from "moment";

const PORT = 4963;
const TIME_FORMAT = "DD/MM/yyyy - HH:mm";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const flights: Flight[] = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  setInterval(() => {
    publishEntityUpdate(socket);
  }, 300);
});

app.get("/flights", (req, res) => {
  res.json({ flights });
});

app.get("/flights/:flightNum", (req, res) => {
  const flight = flights.find((p) => p.flightNumber === req.params.flightNum);
  res.json(flight);
});

server.listen(PORT, () => {
  console.log("server listening on port", PORT);
  for (let i = 0; i < 50; i++) {
    const randomAP1 = Math.floor(Math.random() * 50);
    const randomAP2 = Math.floor(Math.random() * 50);
    flights.push({
      flightNumber: generateFlightNumber(),
      status: "hangar",
      takeoffTime: "01/02/2022 - 12:35",
      landingTime: "02/02/2022 - 14:30",
      takeoffAirport: airports[randomAP1],
      landingAirport: airports[randomAP2],
    });
  }
});

function publishEntityUpdate(socket: Socket) {
  const randomIndex = Math.floor(Math.random() * flights.length);
  const randomFlight = flights[randomIndex];
  const actionType = Math.floor(Math.random() * 3);
  switch (actionType) {
    case 0: // status update
      const chance = Math.random();
      switch (randomFlight.status) {
        case "hangar":
          randomFlight.status = chance >= 0.9 ? "malfunction" : "airborne";
          break;
        case "airborne":
          randomFlight.status =
            chance >= 0.9 ? "malfunction" : chance >= 0.7 ? "hangar" : "airborne";
          break;
        case "malfunction":
          randomFlight.status = chance >= 0.9 ? "hangar" : "malfunction";
          break;
      }
      break;
    case 1: // time delay
      const delayByMin = Math.floor(Math.random() * 120);
      randomFlight.takeoffTime = moment(randomFlight.takeoffTime, TIME_FORMAT)
        .add(delayByMin, "minutes")
        .format(TIME_FORMAT);
      randomFlight.landingTime = moment(randomFlight.landingTime, TIME_FORMAT)
        .add(delayByMin, "minutes")
        .format(TIME_FORMAT);
      break;
    case 2: // destination update
      const newDestination = airports[Math.floor(Math.random() * 50)];
      randomFlight.landingAirport = newDestination;
      break;
  }
  socket.emit("flight-update", randomFlight);
}
