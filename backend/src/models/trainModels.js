import mongoose from "mongoose";

const trainSchema = new mongoose.Schema(
  {
    trainId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["EXPRESS", "PASSENGER", "FREIGHT"], required: true },
    priority: { type: Number, default: 1 },

    schedule: {
      startStation: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
      endStation: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },

      // 👇 stops array is completely optional
      stops: [
        {
          station: { type: mongoose.Schema.Types.ObjectId, ref: "Station" },
          arrivalTime: { type: Date },
          departureTime: { type: Date },
          haltMinutes: { type: Number, default: 0 }
        }
      ],

      departureTime: { type: Date, required: true },
      arrivalTime: { type: Date, required: true },
    },

    currentSection: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    currentTrack: { type: mongoose.Schema.Types.ObjectId, ref: "Track" },
    status: { type: String, enum: ["RUNNING", "STOPPED"], default: "STOPPED" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const trainModel = mongoose.model("Train", trainSchema);
export default trainModel;
