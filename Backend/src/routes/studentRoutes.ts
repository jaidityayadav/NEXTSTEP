// routes/studentRoutes.ts
import express from "express";
import { 
  addToFavorite,
  getStudentStreak,
  applyInternship,
  getAppliedInternships,
  getStudentProfile,
  getFavoriteInternships,
  
  
} from "../controllers/studentController";
import { authenticateUser } from "../middlewares/authMiddleware";



const router = express.Router();

// Student profile and internship-related routes
router.get("/student/profile", authenticateUser, getStudentProfile);
router.post("/student/applyInternship", authenticateUser, applyInternship);
router.post("/student/favorite", authenticateUser, addToFavorite);
router.get("/student/getAppliedInternships", authenticateUser, getAppliedInternships);
router.get("/student/getFavoriteInternships", authenticateUser, getFavoriteInternships);
router.get("/student/streak", authenticateUser, getStudentStreak);




export default router;
