import express from "express";
const router = express.Router();
import { 
  addStation, listStations, getStationById,
  addSection, listSections, getSectionById,
  addTrack, getTracksBySection,
  addSignal, getSignalsByTrack,
  addTrain, listTrains, getTrainById, updateTrain, deleteTrain,
  resolveConflict, listDecisionLogs,

} from "../controllers/adminControllers.js";

import { authAdminMiddleware } from "../middlewares/authMiddleware.js";



router.post("/v1/add/station",authAdminMiddleware, addStation);
router.get("/v1/view/stations",authAdminMiddleware, listStations);
router.get("/v1/view/station/:stationId",authAdminMiddleware, getStationById);

router.post("/v1/add/section",authAdminMiddleware, addSection);
router.get("/v1/view/sections",authAdminMiddleware, listSections);
router.get("/v1/view/section/:sectionId",authAdminMiddleware, getSectionById);

router.post("/v1/add/track",authAdminMiddleware, addTrack);
router.get("/v1/view/tracks/:sectionId",authAdminMiddleware, getTracksBySection);

router.post("/v1/add/signal",authAdminMiddleware, addSignal);
router.get("/v1/view/signals/:trackId",authAdminMiddleware, getSignalsByTrack);

router.post("/v1/add/train",authAdminMiddleware, addTrain);
router.get("/v1/view/trains",authAdminMiddleware, listTrains);
router.get("/v1/view/train/:id",authAdminMiddleware, getTrainById);
router.put("/v1/update/train/:id",authAdminMiddleware, updateTrain);
router.delete("/v1/delete/train/:id",authAdminMiddleware, deleteTrain);


router.post("/v1/decisions/resolve-conflict",authAdminMiddleware, resolveConflict);
router.get("/v1/decisions/logs",authAdminMiddleware, listDecisionLogs);

export default router;
