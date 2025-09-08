import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
  {
    trackId: { type: String, required: true, unique: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    trackType: { type: String, enum: ["UP", "DOWN", "LOOP"], required: true },
    status: { type: String, enum: ["FREE", "OCCUPIED"], default: "FREE" },
    signals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Signal" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const trackModel = mongoose.model("Track", trackSchema);
export default trackModel;
