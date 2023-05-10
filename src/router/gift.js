import express from "express";
import upload from "../middleware/upload.js";
import {createGift, deleteGift, getGift, getGifts, updateGift} from "../controller/gift.js";

const router = express.Router();

// GET
router.get("/", getGifts);
router.get("/:id", getGift);

// POST
router.post("/", upload.single("image"), createGift);

// PUT
router.put("/:id", upload.single("image"), updateGift);

// DELETE
router.delete("/:id", deleteGift);

export default router;
