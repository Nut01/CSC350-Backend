import express from "express";
import upload from "../middleware/upload.js";
import {createUser, deleteUser, getUser, getUsers, getPendingUsers, login, updateUser} from "../controller/user.js";

const router = express.Router();

// GET
router.get("/", getUsers);
router.get("/pending", getPendingUsers);
router.get("/:id", getUser);

// POST
router.post("/", upload.single("image"), createUser);
router.post("/login", login);

// PUT
router.put("/:id", updateUser);

// DELETE
router.delete("/:id", deleteUser);

export default router;
