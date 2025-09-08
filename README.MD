# 🚆 AI-Powered Railway Traffic Control System  
*(Inspired by SIH 2025 Problem Statement: Ministry of Railways – Maximizing Section Throughput Using AI)*

---

## 📌 Problem Statement
Railways are the backbone of Indian transportation. With increasing passenger and freight traffic, managing train movement safely and efficiently is becoming a challenge.  
- Multiple trains run simultaneously between sections.  
- Conflicts occur when two or more trains want the same track.  
- Signal management and train prioritization are complex and mostly manual.  

**Goal:**  
Design a software system that maximizes section throughput (number of trains passing through a section safely) by using **AI/automation** for train traffic control.

---

## 🎯 Our Solution
We propose a **web-based railway traffic control system** that:  
- Receives **real-time telemetry (location, speed)** from trains/simulator.  
- Maps each train to its **section, track, and signal**.  
- Uses **rule-based AI engine** (and later ML) to avoid conflicts & decide priorities.  
- Updates **signals dynamically** (Green/Yellow/Red) for safe movement.  
- Provides operators with a **real-time dashboard** to monitor trains and override decisions if needed.  

---

## 🛠️ Tech Stack
**Frontend:** React.js, Leaflet.js / Mapbox (for maps)  
**Backend:** Node.js, Express.js, MongoDB  
**Realtime:** WebSockets (Socket.io)  
**Simulator:** Custom `simulator.js` (Node/Python script generating fake telemetry)  
**AI/Logic:** Rule-based decision engine (future scope: ML with Python)  

---

## 🏗️ System Architecture

```text
                ┌──────────────┐
                │   Simulator   │
                │ (fake trains) │
                └───────┬───────┘
                        │ Telemetry (location, speed)
                        ▼
                 ┌───────────────┐
                 │    Backend    │
                 │ (Node + DB)   │
                 ├───────────────┤
                 │ APIs + Sockets│
                 │ Rule Engine   │
                 └───────┬───────┘
   ┌───────────────┐     │      ┌───────────────┐
   │   Frontend    │◄────┘────► │    Operator   │
   │ (React + Map) │   Updates  │   Dashboard   │
   └───────────────┘            └───────────────┘
```

## 🛠️ Database Schemas

### User 👤
```text 
User {
  userId: String,
  name: String,
  role: String, // "admin", "operator"
  email: String,
  passwordHash: String
}
```

### Station 🚉
```text 
Station {
  stationId: String,
  name: String,
  location: { lat: Number, lng: Number },
  code: String
}
```
### Section ➡️
```text
Section {
  sectionId: String,
  startStation: ObjectId,
  endStation: ObjectId,
  tracks: [ObjectId],
  lengthKm: Number
}
```
### Track 🔀
```text
Track {
  trackId: String,
  sectionId: ObjectId,
  trackType: String, // UP, DOWN, LOOP / SIDE LINE
  status: String,    // FREE, OCCUPIED
  signals: [ObjectId]
}
```
### Signal 🚦
```text
Signal {
  signalId: String,
  trackId: ObjectId,
  locationKm: Number,
  aspect: String // GREEN, YELLOW, RED
}
```
### Telementry 🗺
```text
Telemetry {
  telemetryId: String,
  trainId: ObjectId,
  location: { lat: Number, lng: Number },
  speed: Number,
  timestamp: Date
}
```
📖 Key Entities in the System
-----------------------------

### 🚉 Station

A **station** is a fixed railway point where trains start, stop, or pass.

**Schema Example:**
`{ "stationId": "ST001", "name": "Ahmedabad Junction", "location": { "lat": 23.0225, "lng": 72.5714 }, "code": "ADI" }`

✅ **Used in System:**

*   Defines the **start and end points** of sections.
    
*   Helps map train journeys (train starts at 🚉 station A → ends at 🚉 station B).
    

### 📏 Section

A **section** is the railway stretch between **two stations**.It contains one or more **tracks**.

**Schema Example:**
`{ "sectionId": "SEC001", "startStation": "ST001", "endStation": "ST002",       "lengthKm": 100, "tracks": ["TR001", "TR002", "TR003"] }   `

✅ **Used in System:**

*   Movement is controlled **section-wise**.
    
*   AI/rule engine checks **which train can enter a section safely**.
    

### 🛤️ Track

A **track** is a physical line inside a section.Each section can have multiple tracks: UP, DOWN, LOOP, etc.

**Schema Example:**

`{ "trackId": "TR001", "sectionId": "SEC001", "trackType": "UP", "status": "FREE", "signals": ["SG001", "SG002"] }   `

✅ **Used in System:**

*   Decides **exact path of a train** within a section.
    
*   Ensures **two trains don’t collide** by checking track status.
    

### 🚦 Signal

A **signal** controls train movement on a track.

**Schema Example:**
`{ "signalId": "SG001", "trackId": "TR001", "locationKm": 25, "aspect": "GREEN", "updatedAt": "2025-09-07T10:30:00Z"  }   `

✅ **Used in System:**

*   Tells train whether to **stop, slow, or go**.
    
*   Updated dynamically when train passes (ex: train passes → signal turns RED behind it).
    

### 🚆 Train

Represents a real or simulated train.

**Schema Example:**

`{ "trainId": "T123", "name": "Shatabdi Express", "type": "EXPRESS", "priority": 3, "schedule": { "startStation": "ST001", "endStation": "ST003", "departureTime": "2025-09-07T06:00:00Z", "arrivalTime": "2025-09-07T09:00:00Z" }, "currentSection": "SEC001", "currentTrack": "TR001","status": "RUNNING"  }   `

✅ **Used in System:**

*   Central entity that moves between sections.
    
*   AI/rule engine decides its path and priority.
    

### 📡 Telemetry

**Telemetry** is live data sent by a train (or simulator).

**Schema Example:**
`{ "telemetryId": "TM001", "trainId": "T123", "location": { "lat": 22.57, "lng": 72.96 }, "speed": 80, "timestamp": "2025-09-07T10:32:00Z" }`

✅ **Used in System:**

*   Backend receives telemetry via /telemetry API.
    
*   Updates train position in DB + notifies frontend dashboard in **real-time via WebSockets**.
    
*   Helps AI check if two trains are too close.
    

🔄 Entity Flow
--------------

👉 **How everything connects together:**

1.  🚆 _Train T123_ sends **📡 telemetry**.
    
2.  Backend maps it to **🛤️ Track TR001** inside **📏 Section SEC001**.
    
3.  Section connects 🚉 **Station Ahmedabad → Vadodara**.
    
4.  System updates **🚦 Signal SG001** to RED once train passes.
    
5.  Operator dashboard shows live position + status.

🎮 Simulator
------------

To test the system without real trains, we built a **simulator**:

*   A simple **simulator.js** script generates random trains.
    
*   It sends **trainId, location (lat/lng), speed, timestamp** to backend via /telemetry.
    
*   This simulates GPS devices installed on real trains.
    

```text
// simulator.js (example)
setInterval(() => {
  const data = {
    trainId: "T123",
    location: { lat: 22.57 + Math.random()/100, lng: 72.96 + Math.random()/100 },
    speed: Math.floor(Math.random() * 100),
    timestamp: new Date()
    };
    axios.post("http://localhost:5000/telemetry", data);
}, 3000); 
```

🤖 Rule-Based AI Engine
-----------------------

Currently, we use **rules** to resolve conflicts:

1.  **Priority Rule** – Express > Passenger > Freight
    
2.  **FCFS (First Come First Serve)** – If same type, whoever arrives first gets track
    
3.  **Delay Minimization** – Trains with higher delay get preference
    
4.  **Safety Rule** – At least one section gap between two trains
    

_Future:_ Train historical data + ML model for smarter predictions.

🖥️ Frontend (React Dashboard)
------------------------------

*   Real-time **map of stations, sections, tracks**
    
*   Live train positions updated from backend WebSockets
    
*   **Signal status (Green/Yellow/Red)** on tracks
    
*   Operator panel → override AI decisions manually
    

🔮 Future Scope
---------------

*   Integration with **real railway telemetry devices**
    
*   Use of **track circuits** for more accuracy
    
*   Advanced **ML models** for throughput optimization
    
*   Mobile app for operators
    
🚀 How to Run Locally
---------------------

1.  Clone repo
    
2.  cd backendnpm installnpm start
    
3.  cd frontendnpm installnpm start
    
4.  node simulator.js
    

✨ Conclusion
------------

This project shows how **AI and automation can optimize train traffic control**, ensuring **higher safety, reduced delays, and better utilization of tracks**.

It bridges the gap between simulation and real-world implementation, and can serve as a base for future **smart railway solutions in India**.