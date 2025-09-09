import operatorAssignmentModel from "../models/operatorAssignmentModels.js";
import sectionControllerAssignmentModel from "../models/sectionControllerAssignmentModels.js"
// ===================== OPERATOR ASSIGNMENTS =====================
export const assignOperatorToStation = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const { operatorId, stationId } = req.body;
    const assignment = await operatorAssignmentModel.create({
      operatorId,
      stationId,
      assignedBy: admin._id,
    });

    res.status(201).json({ message: "Operator assigned to station", success: true, assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error assigning operator", success: false });
  }
};

export const listOperatorAssignments = async (req, res) => {
  try {
    const assignments = await operatorAssignmentModel
      .find()
      .populate("operatorId", "name email role")
      .populate("stationId", "name code stationId");

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching operator assignments", success: false });
  }
};

export const removeOperatorAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await operatorAssignmentModel.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Assignment not found", success: false });

    res.status(200).json({ message: "Operator assignment removed", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing operator assignment", success: false });
  }
};

// ===================== SECTION CONTROLLER ASSIGNMENTS =====================
export const assignControllerToSection = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const { controllerId, sectionId } = req.body;
    const assignment = await sectionControllerAssignmentModel.create({
      controllerId,
      sectionId,
      assignedBy: admin._id,
    });

    res.status(201).json({ message: "Controller assigned to section", success: true, assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error assigning controller", success: false });
  }
};

export const listControllerAssignments = async (req, res) => {
  try {
    const assignments = await sectionControllerAssignmentModel
      .find()
      .populate("controllerId", "name email role")
      .populate("sectionId", "sectionId startStation endStation");

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching controller assignments", success: false });
  }
};

export const removeControllerAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await sectionControllerAssignmentModel.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Assignment not found", success: false });

    res.status(200).json({ message: "Controller assignment removed", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing controller assignment", success: false });
  }
};