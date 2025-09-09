import mongoose from "mongoose";

const sectionControllerAssignmentSchema = new mongoose.Schema(
  {
    controllerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Admin who assigned
  },
  { timestamps: true }
);

const sectionControllerAssignmentModel = mongoose.model("SectionControllerAssignment", sectionControllerAssignmentSchema);
export default sectionControllerAssignmentModel;
