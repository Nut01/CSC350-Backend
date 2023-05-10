import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

export const getGifts = async (req, res) => {
  try {
    const gifts = await prisma.gift.findMany();
    return res.status(200).json(gifts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getGift = async (req, res) => {
  try {
    const { id } = req.params;
    const gift = await prisma.gift.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json(gift);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createGift = async (req, res) => {
  try {
    const { name, description, point } = req.body;
    const image = req.file.path;
    const gift = await prisma.gift.create({
      data: {
        name,
        description,
        point: parseInt(point),
        image: fs.readFileSync(image),
      },
    });
    await fs.promises.unlink(image);
    return res.status(201).json(gift);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateGift = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, point } = req.body;
    let image = null;
    if (req.file) {
      image = req.file.path;
    }
    const gift = await prisma.gift.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(point && { point: parseInt(point) }),
        ...(image && { image: fs.readFileSync(image) }),
      },
    });
    if (image) {
      await fs.promises.unlink(image);
    }
    return res.status(200).json(gift);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteGift = async (req, res) => {
  try {
    const { id } = req.params;
    // delete gift history
    await prisma.gift_history.deleteMany({
      where: {
        gift_id: parseInt(id),
      },
    });

    // delete gift
    await prisma.gift.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({ message: "Delete gift success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
