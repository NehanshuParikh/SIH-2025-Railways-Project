import mongoose from "mongoose";

const operatorAssignmentSchema = new mongoose.Schema(
  {
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Admin who assigned
  },
  { timestamps: true }
);

const operatorAssignmentModel = mongoose.model("OperatorAssignment", operatorAssignmentSchema);
export default operatorAssignmentModel;
