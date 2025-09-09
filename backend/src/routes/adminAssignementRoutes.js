import express from "express";
import {
  assignOperatorToStation,
  listOperatorAssignments,
  removeOperatorAssignment,
  assignControllerToSection,
  listControllerAssignments,
  removeControllerAssignment,
} from "../controllers/adminAssignmentControllers.js";
import { authAdminMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Operator Assignments
router.post("/v1/assign/operator", authAdminMiddleware, assignOperatorToStation);
router.get("/v1/view/operators", authAdminMiddleware, listOperatorAssignments);
router.delete("/v1/remove/operator/:id", authAdminMiddleware, removeOperatorAssignment);

// Section Controller Assignments
router.post("/v1/assign/controller", authAdminMiddleware, assignControllerToSection);
router.get("/v1/view/controllers", authAdminMiddleware, listControllerAssignments);
router.delete("/v1/remove/controller/:id", authAdminMiddleware, removeControllerAssignment);

export default router;
