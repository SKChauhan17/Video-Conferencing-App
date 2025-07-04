import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, joinRoom } from "../controllers/roomController.js";

const router = express.Router();

router.post("/", protect, createRoom);          // POST /api/rooms
router.post("/:roomId/join", protect, joinRoom); // POST /api/rooms/:roomId/join

export default router;