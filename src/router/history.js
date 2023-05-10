import express from "express";
import upload from "../middleware/upload.js";
import {
    getHistories,
    getHistory,
    getHistoriesByQuery,
    createHistory,
    updateHistory,
    deleteHistory
} from "../controller/history.js";

const router = express.Router();

// GET
router.get("/", getHistories);
router.get("/query", getHistoriesByQuery);
router.get("/:id", getHistory);

// POST
router.post("/", upload.single("pay_image"), createHistory);

// PUT
router.put("/:id", updateHistory);

// DELETE
router.delete("/:id", deleteHistory);

export default router;
