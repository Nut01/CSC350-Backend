import multer from "multer"
import path from "path"
import fs from "fs"

const imageFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"]
    const mimetAypeIsValid = allowedMimeTypes.includes(file.mimetype)
    const extensionIsValid = [".jpg", ".jpeg", ".png", ".JPG"].some(ext =>
        file.originalname.endsWith(ext)
    )
    if (mimetAypeIsValid && extensionIsValid) {
        cb(null, true)
    } else {
        cb(new Error("Please upload an image file (jpg, jpeg, png, gif)."))
    }
}

const storage = multer.diskStorage({
    destination: (_, file, cb) => {
        const dir = '/tmp'

        if (!fs.existsSync(dir)) {
            console.log("Creating uploads directory")
            fs.mkdirSync(dir, { recursive: true })
        }
        cb(null, dir)
    },
    filename: (_, file, cb) => {
        const randomStr = Math.random()
            .toString(36)
            .substr(2, 5)
        cb(null, `${Date.now()}-${randomStr}-image-${file.originalname}`)
    }
})

const setupMulter = () => {
    const uploadFile = multer({ storage, fileFilter: imageFilter })
    return uploadFile
}

export default setupMulter()
