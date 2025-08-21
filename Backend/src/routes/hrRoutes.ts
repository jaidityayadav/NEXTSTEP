// routes/hrRoutes.ts
import express from "express";
import { postInternship, getHRavgSalary,deleteInternship,getHRInternships,editInternship,getInternshipById,getHRProfile } from "../controllers/hrController";
import { authenticateUser, isHR } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/hr/postInternship", authenticateUser, isHR, postInternship);
router.delete("/hr/deleteInternship/:id", authenticateUser, isHR, deleteInternship);
router.get("/hr/profile", authenticateUser, isHR, getHRProfile);
router.get("/hr/internships", authenticateUser, isHR, getHRInternships);
router.put("/hr/internship/:id", authenticateUser, isHR, editInternship);
router.get("/hr/internship/:id", authenticateUser, isHR, getInternshipById);



router.get("/hr/avgsalary", authenticateUser, isHR, getHRavgSalary);



export default router;
