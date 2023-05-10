import express from "express";
import upload from "../middleware/upload.js";
import  {getProducts, getProduct, createProduct, updateProduct, deleteProduct} from "../controller/product.js";

const router = express.Router();

// GET
router.get("/", getProducts);
router.get("/:id", getProduct);

// POST
router.post("/", upload.single("image"), createProduct);

// PUT
router.put("/:id", upload.single("image"), updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

export default router;
