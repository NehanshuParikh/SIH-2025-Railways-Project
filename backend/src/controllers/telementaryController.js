import telemetryModel from '../models/telementaryModels.js'
import { io } from '../../server.js'

// ===================== ADD TELEMETRY =====================
export const addTelemetry = async (req, res) => {
  try {
    // Save raw telemetry
    const telemetry = await telemetryModel.create(req.body);

    // Re-fetch telemetry with populated train
    const populatedTelemetry = await telemetryModel
      .findById(telemetry._id)
      .populate("trainId", "name trainId"); // only include needed fields

    // 🔴 Broadcast populated telemetry
    io.emit("telemetryUpdate", populatedTelemetry);

    res.status(201).json({
      message: "Telemetry saved successfully",
      success: true,
      telemetry: populatedTelemetry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving telemetry", success: false });
  }
};

// ===================== TELEMETRY =====================
export const getTelemetryByTrain = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const { trainId } = req.params;
    const telemetry = await Telemetry.find({ trainId }).sort({ timestamp: -1 }).limit(1);

    if (!telemetry || telemetry.length === 0) {
      return res.status(404).json({ message: "No telemetry found for this train", success: false });
    }

    res.status(200).json({ message: "Latest telemetry fetched", success: true, telemetry: telemetry[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching telemetry", success: false });
  }
};