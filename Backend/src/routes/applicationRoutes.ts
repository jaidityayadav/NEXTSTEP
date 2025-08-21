// routes/applicationRoutes.js

import express from "express";
import {
  createApplication,
  getApplications,getApplicationById,getStudentApplications,
  updateApplicationStatus,
} from "../controllers/applicationController";
import { authenticateUser } from "../middlewares/authMiddleware";
const router = express.Router();

// Route to create an application
router.post("/application", createApplication);

// Route to get all applications
router.get("/hr/applications", getApplications);

// Route to get a specific application
router.get("/application/:id", getApplicationById);

router.get("/applications", authenticateUser, getStudentApplications);
// Route to update the status of an application
router.put("/application/:id", updateApplicationStatus);

export default router;
