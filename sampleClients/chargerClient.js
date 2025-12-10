import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:9000/ocpp", "ocpp2.0.1");

let chargingInterval = null;
let batteryLevel = null;
let heartbeatInterval = null;
let status = "Available";

function sendHeartbeat() {
  ws.send(
    JSON.stringify({
      type: "Heartbeat",
      timestamp: Date.now(),
      status,
    })
  );
  console.log("Heartbeat → Status:", status);
}

ws.on("open", () => {
  console.log("Charger connected to OCPP CSMS");

  ws.send(
    JSON.stringify({
      type: "BootNotification",
      chargePointVendor: "KaushikEV",
      chargePointModel: "Model-1",
      timestamp: Date.now(),
    })
  );

  heartbeatInterval = setInterval(sendHeartbeat, 10000);
});


ws.on("message", (raw) => {
  const msg = JSON.parse(raw.toString());
  console.log("CSMS → Charger:", msg);

  if (msg.type === "RemoteStartTransaction") {
    status = "Charging"
    console.log("Starting transaction...");
    batteryLevel = msg.initBattery??0;
    ws.send(
        JSON.stringify({
        type: "TransactionStarted",
        timestamp: Date.now(),
        meterStart: batteryLevel,
        })
    );
    console.log("Initial Battery:", batteryLevel);
    chargingInterval = setInterval(() => {
      batteryLevel += 1;
      ws.send(
        JSON.stringify({
        type: "MeterValues",
        timestamp: Date.now(),
        value: batteryLevel,
      })
    );
      console.log(`Battery: ${batteryLevel}`);
      if (batteryLevel >= 100) {
        stopCharging();
      }
    }, 1000);
  }

  if (msg.type === "RemoteStopTransaction") {
  status = "Finishing"
  stopCharging();

  }
});

function stopCharging() {
  if (chargingInterval) {
    clearInterval(chargingInterval);
    chargingInterval = null;
  }
  console.log("Stopping transaction...");
  ws.send(
    JSON.stringify({
      type: "TransactionStopped",
      timestamp: Date.now(),
      meterStop: batteryLevel,
    })
  );
  batteryLevel = null;
  status = "Available"
}
