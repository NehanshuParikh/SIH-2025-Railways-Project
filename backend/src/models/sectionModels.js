import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true, unique: true },
    startStation: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
    endStation: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
    lengthKm: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const sectionModel = mongoose.model("Section", sectionSchema);
export default sectionModel;
