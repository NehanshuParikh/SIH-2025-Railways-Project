// utils/simulator.js
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import trainModel from "../models/trainModels.js";

dotenv.config();

const API_BASE = process.env.API_BASE_FOR_TELEMENTARY_SENDING_TO_DB; // change if needed
const ADMIN_TOKEN = process.env.ADMIN_TOKEN; // store your admin JWT in .env

const mongoDBLink = process.env.MONGO_URI;
console.log(mongoDBLink)
// helper: random telemetry generator
function generateTelemetry(trainId) {
  return {
    telemetryId: "TM" + Math.floor(Math.random() * 100000), // unique random ID
    trainId: trainId,
    location: {
      lat: 23.0 + Math.random() * 0.1, // random lat near 23.x
      lng: 72.5 + Math.random() * 0.1, // random lng near 72.x
    },
    speed: Math.floor(Math.random() * 120), // 0–120 km/h
  };
}

async function runSimulator() {
  try {
    await mongoose.connect(mongoDBLink);
    console.log("✅ Connected to DB for simulator");

    // fetch all trains
    const trains = await trainModel.find();
    if (!trains.length) {
      console.log("⚠️ No trains found in DB. Add trains first.");
      return;
    }

    console.log(`🚆 Found ${trains.length} trains. Starting simulator...`);

    let counter = 0;
    const interval = setInterval(async () => {
      counter++;

      for (const train of trains) {
        const telemetry = generateTelemetry(train._id);

        try {
          const res = await axios.post(
            `${API_BASE}/telemetry`,
            telemetry,
            { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
          );

          console.log(`📡 Telemetry sent for ${train.name}:`, res.data.message);
        } catch (err) {
          console.error("❌ Error sending telemetry:", err.response?.data || err.message);
        }
      }

      // stop after 3 iterations (9s if 3s each)
      if (counter >= 3) {
        clearInterval(interval);
        console.log("🛑 Simulator stopped after 10 cycles.");
        mongoose.disconnect();
      }
    }, 3000); // every 3 sec
  } catch (error) {
    console.error("❌ Simulator failed:", error.message);
  }
}

runSimulator();
