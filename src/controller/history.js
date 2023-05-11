import {PrismaClient} from '@prisma/client'
import * as fs from "fs";

const prisma = new PrismaClient()

export const getHistories = async (req, res) => {
    try {
        const histories = await prisma.history.findMany()
        return res.status(200).json(histories)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getHistory = async (req, res) => {
    try {
        const {id} = req.params
        const history = await prisma.history.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json(history)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


// get history by query username or tracking number
export const getHistoriesByQuery = async (req, res) => {
    try {
        const {username, tracking_number} = req.query
        const histories = await prisma.history.findMany({
            where: {
                OR: [{
                    username
                }, {
                    tracking_number: tracking_number == 'null' ? null : tracking_number
                }]
            }
        })
        return res.status(200).json(histories)

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const createHistory = async (req, res) => {
    try {
        const {product_id, username, amount, net_price, name, tel, address} = req.body

        const history = await prisma.history.create({
            data: {
                product_id: parseInt(product_id),
                username,
                amount: parseInt(amount),
                net_price: parseInt(net_price),
                name,
                tel,
                address,
                pay_image : fs.readFileSync(req.file.path)
            }
        })

        // every amount 500 will get 5 point
        const point = Math.floor(parseInt(amount) / 500) * 5
        await prisma.users.update({
            where: {
                username
            },
            data: {
                point: {
                    increment: point
                }
            }
        })

        // await fs.promises.unlink(req.file.path)
        return res.status(201).json(history)
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}

export const updateHistory = async (req, res) => {
    try {
        const {id} = req.params
        const {tracking_number} = req.body
        const history = await prisma.history.update({
            where: {
                id: parseInt(id)
            }, data: {
                tracking_number
            }
        })
        return res.status(200).json(history)
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}

export const deleteHistory = async (req, res) => {
    try {
        const {id} = req.params
        await prisma.history.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({message: "Delete history success"})
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}
