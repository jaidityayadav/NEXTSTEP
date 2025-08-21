import express from "express";
import { sendFeedback } from "../controllers/feedbackController";

const router = express.Router();

router.post("/feedback", sendFeedback)

export default router;