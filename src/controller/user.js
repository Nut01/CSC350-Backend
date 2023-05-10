import {PrismaClient} from '@prisma/client'
import * as fs from "fs";

const prisma = new PrismaClient()

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getUser = async (req, res) => {
    try {
        const {id} = req.params
        const user = await prisma.users.findUnique({
            where: {
                username: id
            },
            select: {
                username: true,
                role: true,
                point: true,
                cid_image: true,
            }
        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getPendingUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            where: {
                role: 0
            },
            select: {
                username: true,
                role: true,
                cid_image: false
            }
        })
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await prisma.users.findUnique({
            where: {
                username
            },
            select: {
                username: true,
                password: true,
                role: true
            }
        })
        if (!user) {
            return res.status(400).json({message: "Username not found"})
        }
        if (user.password !== password) {
            return res.status(400).json({message: "Password incorrect"})
        }
        const {password: _, ...rest} = user
        return res.status(200).json(rest)
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}

export const createUser = async (req, res) => {
    try {
        const {username, password} = req.body
        const userExists = await prisma.users.findUnique({
            where: {
                username
            }, select: {
                username: true,
            }
        })
        if (userExists) {
            return res.status(400).json({message: "Username already exists"})
        }

        if (!req.file) return res.status(400).json({message: "Please upload CID image"})
        const user = await prisma.users.create({
            data: {
                username, password, cid_image: fs.readFileSync(req.file.path)
            }, select: {
                username: true, role: true
            }
        })
        await fs.promises.unlink(req.file.path)
        return res.status(201).json(user)
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}

export const updateUser = async (req, res) => {
    try {
        const {id} = req.params
        const {role} = req.body
        const user = await prisma.users.update({
            where: {
                username: id
            }, data: {
                role: parseInt(role), cid_image: null
            }, select: {
                username: true, role: true
            }
        })
        return res.status(200).json(user)
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        await prisma.users.delete({
            where: {
                username: id
            }
        })
        return res.status(200).json({message: "Delete user successfully"})
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
}
