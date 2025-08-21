import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
 getNoticesByHr,deleteNoticeById
} from "../controllers/noticeController";
import { authenticateUser, isHR } from "../middlewares/authMiddleware"; // Import your authentication and HR middleware

const router = express.Router();

// Route for creating a notice (HR only)
router.post("/notice", authenticateUser, isHR, createNotice);

// Route to get all notices (accessible by anyone)
router.get("/notice/all", getAllNotices);

// Route to get a specific notice by ID (accessible by anyone)
router.get("/notice/:id", getNoticeById);
router.get('/notices/hr', authenticateUser, isHR, getNoticesByHr);
router.delete('/notice/:id', authenticateUser, deleteNoticeById);


// Route to delete a notice (HR only)
// router.delete("/notice/:id", authenticateUser, isHR, deleteNotice);

export default router;
