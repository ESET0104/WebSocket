**WEBSOCKET**

A WebSocket is a browser-supported, bi-directional, full-duplex, real-time communication protocol
  
The websocket is an real time bi-directional communication between:
  1. EV Charger (simulated hardware client)
  2. OCPP CSMS Backend (WebSocket server)
  3. User Web Portal (Socket.IO frontend)
using websockets as the core communication layer.

**WHAT DOES A WEBSOCKET DO?**

A WebSocket: Creates a permanent two-way communication channel between client and server
  1. Keeps a continous open connection
  2. Allows both client & server to send data at any time.
  3. Enables real-time communication
  4. Replaces the traditional "request-> response -> close" pattern of HTTP
  5. Acts like a live pipe between the two systems
  
**WHY DO WE NEED WEBSOCKETS?**
WebSockets are needed for applications that require:
  * Instant updates
  * Live streaming of data
  * Two-way communication
  * Persistent, low-latency connections
  * Real-time dashboards and control
  
This Websocket is especially relevant for EV systems where:
  1. Backend must send commands to charger at any time.
  2. Charger must push continuous updates (heartbeat, meter values)
  3. Connection must remain open with low latency

    
**Message Flow:**

User <-- (Socket.IO) --> OCPP Server <-- (Websocket) --> EV Charger(Websocket client)

**Communication Sequence:** 

 1. Charger connects to the OCPP server over WebSockets.
 2. User Portal connects to a backend using Socket.IO
 3. User -> Server -> Charger: RemoteStart & RemoteStop charging.
 4. Charger -> Server -> User: Heartbeat, MeterValues, Status updates.
 5. Live logs show real-time device behavior.

**Required Packages:**
1. socket.io
2. express
3. ws
4. cors
5. socket.io-client
   

**SYSTEM COMPONENTS**

*EV Charger(Client):* 
In my file sampleClients/chargerClient.js

 Connects to CSMS over Websocket
 Sends: 
  * BootNotification
  * Heartbeat
  * TransactionStarted
  * MeterValues
  * TransactionStopped
Responds to:
  * RemoteStartTransaction
  * RemoteStopTransaction

Stimulates battery changing by increasing battery level every second.

*OCPP Server (CSMS Backend):* 
 In my file ocppServer.js

  * Accepts websocket connections from chargers
  * Validates websocket protocol
  * Forwards charger messages to user backend.
  * Send control commands to chargers:
    * RemoteStartTransaction
    * RemoteStopTransaction

*User Backend(Socket.IO):* 
 In my file server.js

  * Accepts user actions:
    * RemoteStart
    * RemoteStop
  * Forwards commands to OCPP server
  * Streams charger updates back to browser
  * Bridges:
    Websocket (charger) <-> Socket.IO(user)

*User Client(Frontend):* 
userClient.html

Shows: * Charger Events Log
       * Battery progression
       * Status changes in real-time
       * Start / Stop Charging controls

**Sample Output**
given below is a snapshot of the user UI in real time:
<img width="953" height="507" alt="image" src="https://github.com/user-attachments/assets/b2a07773-c10b-4ed1-9fdc-6eeaf11bca9b" />

**Key Deliverables**
  * Understanding of WebSocket fundamentals
  * Implementation of Socket.IO vs WS (protocol differences)
  * Single backend bridging two protocols
  * Simulating real EV charging logic
  * Lightweight OCPP-like message design
  * Real-time UI communication
