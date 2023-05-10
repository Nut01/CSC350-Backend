import express from "express";
import {
    getGiftHistories,
    getGiftHistory,
    getGiftHistoriesByQuery,
    createGiftHistory,
    updateGiftHistory,
    deleteGiftHistory
} from "../controller/giftHistory.js";

const router = express.Router();

// GET
router.get("/", getGiftHistories);
router.get("/query", getGiftHistoriesByQuery);
router.get("/:id", getGiftHistory);

// POST
router.post("/", createGiftHistory);

// PUT
router.put("/:id", updateGiftHistory);

// DELETE
router.delete("/:id", deleteGiftHistory);


export default router;
