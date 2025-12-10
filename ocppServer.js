import { createServer } from "http";
import { WebSocketServer } from "ws";
import io from "./server.js";

const PORT = 9000;
const PROTOCOL = "ocpp2.0.1";

const chargers = {};

const server = createServer();

const wss = new WebSocketServer({
  server,
  path: "/ocpp",
  handleProtocols: (protocols) =>
    protocols.has(PROTOCOL) ? PROTOCOL : false,
});

server.listen(PORT, () => {
  console.log(`OCPP CSMS running at ws://localhost:${PORT}/ocpp`);
});

wss.on("connection", (ws, req) => {
  console.log("Charger connected");

  const chargerId = "CP_001";
  chargers[chargerId] = ws;

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    console.log("From Charger:", msg);

    io.emit("fromOcpp", msg);
  });

  ws.on("close", () => {
    console.log("Charger disconnected");
    delete chargers[chargerId];
  });
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("RemoteStart", (data) => {
    const ws = chargers[data.chargerId];
    if (!ws) return console.log("Charger not connected");
    const initBattery = data.initValue;

    ws.send(
      JSON.stringify({
        type: "RemoteStartTransaction",
        idTag: data.idTag,
        timestamp: Date.now(),
        initBattery
      })
    );
  });

  socket.on("RemoteStop", (data) => {
    const ws = chargers[data.chargerId];
    if (!ws) return console.log("Charger not connected");

    ws.send(
      JSON.stringify({
        type: "RemoteStopTransaction",
        timestamp: Date.now(),
      })
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
