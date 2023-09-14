import { Socket, io } from "socket.io-client";
import * as dotenv from "dotenv";
import EventSource from "eventsource";
import { emitEvent } from "./utils";

require("isomorphic-fetch");

const debug = require("debug")("main");

// Load environment variables from .env file
dotenv.config();

const BASE_URL = "https://cloud.host.spectoda.com"; // replace with your server URL
const NAMESPACE = process.env.NAMESPACE || "";
const EVENT_LABELS = process.env.EVENT_LABELS ? process.env.EVENT_LABELS.split(",") : [];

const socket: Socket = io(BASE_URL);

socket.on("connect", () => {
  debug("Connected to Socket.io server");
  socket.emit("namespace", NAMESPACE); // Joining the group
});

socket.on("disconnect", () => {
  debug("Disconnected from Socket.io server");
});

socket.on("error", (error: any) => {
  debug("Error:", error);
});

socket.on("event", async (data: any) => {
  emitEvent(data);
});

// Set up the event source connection
const evs = new EventSource(`http://localhost:8888/events`);

evs.onopen = () => {
  debug("Connected to EventSource server");
};

evs.onmessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  debug("received event %o", data);

  if (EVENT_LABELS.includes(data.label)) {
    socket.volatile.emit("event", data);
  }

  // Loop through EVENT_LABELS and emit the data for each label
};
