import {PrismaClient} from '@prisma/client'
import * as fs from "fs";

const prisma = new PrismaClient()

export const getGiftHistories = async (req, res) => {
    try {
        const giftHistories = await prisma.gift_history.findMany()
        return res.status(200).json(giftHistories)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getGiftHistory = async (req, res) => {
    try {
        const {id} = req.params
        const giftHistory = await prisma.gift_history.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json(giftHistory)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getGiftHistoriesByQuery = async (req, res) => {
    try {
        const {username, tracking_number} = req.query
        const giftHistories = await prisma.gift_history.findMany({
            where: {
                OR: [{
                    username
                }, {
                    tracking_number: tracking_number == 'null' ? null : tracking_number
                }]
            }
        })
        return res.status(200).json(giftHistories)

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const createGiftHistory = async (req, res) => {
    try {
        const {username, gift_id, amount, net_point, name, tel, address} = req.body
        const giftHistory = await prisma.gift_history.create({
            data: {
                username,
                gift_id: parseInt(gift_id),
                amount: parseInt(amount),
                net_point: parseInt(net_point),
                name,
                tel,
                address,
            }
        })

        await prisma.users.update({
            where: {
                username
            }, data: {
                point: {
                    decrement: parseInt(net_point)
                }
            }
        })
        return res.status(201).json(giftHistory)
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}

export const updateGiftHistory = async (req, res) => {
    try {
        const {id} = req.params
        const {tracking_number} = req.body
        const giftHistory = await prisma.gift_history.update({
            where: {
                id: parseInt(id)
            }, data: {
                tracking_number
            }
        })
        return res.status(200).json(giftHistory)
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}

export const deleteGiftHistory = async (req, res) => {
    try {
        const {id} = req.params
        await prisma.gift_history.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({message: "Delete gift history success"})
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}
