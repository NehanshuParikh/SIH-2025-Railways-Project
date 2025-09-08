import mongoose from "mongoose";

const signalSchema = new mongoose.Schema(
  {
    signalId: { type: String, required: true, unique: true },
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    locationKm: { type: Number, required: true },
    aspect: { type: String, enum: ["GREEN", "YELLOW", "RED"], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const signalModel = mongoose.model("Signal", signalSchema);
export default signalModel;
