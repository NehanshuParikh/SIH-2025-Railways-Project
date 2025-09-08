// controllers/adminController.js
import stationModel from '../models/stationModels.js'
import sectionModel from '../models/sectionModels.js'
import trackModel from '../models/trackModels.js'
import signalModel from '../models/signalModels.js'
import trainModel from '../models/trainModels.js'
import telemetryModel from '../models/telementaryModels.js'

// ===================== ADD STATION =====================
export const addStation = async (req, res) => {
  try {
    const admin = req.admin; // info about the admin making the request
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { stationId, name, location, code } = req.body;

    // Check if stationId or code already exists
    const existingStation = await stationModel.findOne({ $or: [{ stationId }, { code }] });
    if (existingStation) {
      return res.status(400).json({ message: "Station already exists", success: false });
    }

    const station = await stationModel.create({
      stationId,
      name,
      location,
      code,
      createdBy: admin._id
    });

    res.status(201).json({ message: "Station added successfully", success: true, station });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in addStation", success: false });
  }
};

// ===================== LIST ALL STATIONS =====================
export const listStations = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const stations = await stationModel.find().sort({ name: 1 }); // sorted alphabetically by name

    res.status(200).json({ message: "Stations fetched successfully", success: true, stations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in listStations", success: false });
  }
};

// ===================== GET STATION BY ID =====================
export const getStationById = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { stationId } = req.params;

    const station = await stationModel.findOne({ stationId }).populate('createdBy', 'name userId');

    if (!station) {
      return res.status(404).json({ message: "Station not found", success: false });
    }

    res.status(200).json({ message: "Station fetched successfully", success: true, station });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in getStationById", success: false });
  }
};

// ===================== ADD SECTION =====================
export const addSection = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { sectionId, startStation, endStation, tracks = [], lengthKm } = req.body;

    // Check if sectionId already exists
    const existingSection = await sectionModel.findOne({ sectionId });
    if (existingSection) {
      return res.status(400).json({ message: "Section already exists", success: false });
    }

    const section = await sectionModel.create({
      sectionId,
      startStation,
      endStation,
      tracks,
      lengthKm,
      createdBy: admin._id
    });

    res.status(201).json({ message: "Section added successfully", success: true, section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in addSection", success: false });
  }
};

// ===================== LIST ALL SECTIONS =====================
export const listSections = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const sections = await sectionModel.find()
      .populate("startStation endStation", "stationId name code")
      .populate("createdBy", "name userId")
      .sort({ sectionId: 1 });

    res.status(200).json({ message: "Sections fetched successfully", success: true, sections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in listSections", success: false });
  }
};

// ===================== GET SECTION BY ID =====================
export const getSectionById = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { sectionId } = req.params;

    const section = await sectionModel.findOne({ sectionId })
      .populate("startStation endStation", "stationId name code")
      .populate("createdBy", "name userId");

    if (!section) {
      return res.status(404).json({ message: "Section not found", success: false });
    }

    res.status(200).json({ message: "Section fetched successfully", success: true, section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in getSectionById", success: false });
  }
};

// ===================== ADD TRACK =====================
export const addTrack = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { trackId, sectionId, trackType, status = "FREE", signals = [] } = req.body;

    // Check if section exists
    const section = await sectionModel.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found", success: false });
    }

    // Check if trackId already exists
    const existingTrack = await trackModel.findOne({ trackId });
    if (existingTrack) {
      return res.status(400).json({ message: "Track already exists", success: false });
    }

    const track = await trackModel.create({
      trackId,
      sectionId,
      trackType,
      status,
      signals,
      createdBy: admin._id
    });

    // Optionally, you can add the track to section's tracks array
    section.tracks.push(track._id);
    await section.save();

    res.status(201).json({ message: "Track added successfully", success: true, track });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in addTrack", success: false });
  }
};

// ===================== GET TRACKS BY SECTION =====================
export const getTracksBySection = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { sectionId } = req.params;

    const tracks = await trackModel.find({ sectionId })
      .populate("sectionId", "sectionId startStation endStation") // populate section info
      .populate("signals") // optional: you can populate signals if needed
      .populate("createdBy", "name userId");

    if (!tracks || tracks.length === 0) {
      return res.status(404).json({ message: "No tracks found for this section", success: false });
    }

    res.status(200).json({ message: "Tracks fetched successfully", success: true, tracks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in getTracksBySection", success: false });
  }
};

// ===================== SIGNALS =====================
export const addSignal = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const { signalId, trackId, locationKm, aspect } = req.body;

    const track = await trackModel.findById(trackId);
    if (!track) return res.status(404).json({ message: "Track not found", success: false });

    const existingSignal = await signalModel.findOne({ signalId });
    if (existingSignal) return res.status(400).json({ message: "Signal already exists", success: false });

    const signal = await signalModel.create({ signalId, trackId, locationKm, aspect, createdBy: admin._id });

    track.signals.push(signal._id);
    await track.save();

    res.status(201).json({ message: "Signal added successfully", success: true, signal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding signal", success: false });
  }
};

export const getSignalsByTrack = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const { trackId } = req.params;
    const signals = await signalModel.find({ trackId });

    if (!signals || signals.length === 0) {
      return res.status(404).json({ message: "No signals found", success: false });
    }

    res.status(200).json({ message: "Signals fetched successfully", success: true, signals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching signals", success: false });
  }
};

// ===================== TRAINS =====================
export const addTrain = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const train = await trainModel.create({ ...req.body, createdBy: admin._id });
    res.status(201).json({ message: "Train added successfully", success: true, train });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding train", success: false });
  }
};

export const listTrains = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const trains = await trainModel.find()
      .populate("schedule.startStation schedule.endStation", "stationId name code")
      .populate("currentSection currentTrack", "sectionId trackId")
      .sort({ trainId: 1 });

    res.status(200).json({ message: "Trains fetched successfully", success: true, trains });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching trains", success: false });
  }
};

export const getTrainById = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const { id } = req.params;
    const train = await trainModel.findById(id)
      .populate("schedule.startStation schedule.endStation", "stationId name code")
      .populate("currentSection currentTrack", "sectionId trackId");

    if (!train) return res.status(404).json({ message: "Train not found", success: false });

    res.status(200).json({ message: "Train fetched successfully", success: true, train });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching train", success: false });
  }
};

export const updateTrain = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const { id } = req.params;
    const train = await trainModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!train) return res.status(404).json({ message: "Train not found", success: false });

    res.status(200).json({ message: "Train updated successfully", success: true, train });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating train", success: false });
  }
};

export const deleteTrain = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    const { id } = req.params;
    const train = await trainModel.findByIdAndDelete(id);

    if (!train) return res.status(404).json({ message: "Train not found", success: false });

    res.status(200).json({ message: "Train deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting train", success: false });
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

// ===================== DECISIONS / AI =====================
export const resolveConflict = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    // This is a placeholder: integrate AI/rule engine here
    res.status(200).json({ message: "Conflict resolved (demo)", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resolving conflict", success: false });
  }
};

export const listDecisionLogs = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized", success: false });

    // Placeholder for logs
    res.status(200).json({ message: "Decision logs fetched (demo)", success: true, logs: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching decision logs", success: false });
  }
};