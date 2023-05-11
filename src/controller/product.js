import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file.path;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),
        image: fs.readFileSync(image),
      },
    });
    // await fs.promises.unlink(image);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    let image = null;
    if (req.file) {
      image = req.file.path;
    }
    const product = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseInt(price) }),
        ...(image && { image: fs.readFileSync(image) }),
      },
    });
    if (image) {
      // await fs.promises.unlink(image);
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // delete history
    await prisma.history.deleteMany({
      where: {
        product_id: parseInt(id),
      },
    });
    // delete product
    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
