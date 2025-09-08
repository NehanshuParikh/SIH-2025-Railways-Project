import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema(
  {
    telemetryId: { type: String, required: true, unique: true },
    trainId: { type: mongoose.Schema.Types.ObjectId, ref: "Train", required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    speed: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const telemetryModel = mongoose.model("Telemetry", telemetrySchema);
export default telemetryModel;
