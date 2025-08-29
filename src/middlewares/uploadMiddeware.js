import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Cấu hình nơi lưu file + đặt tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }) // Tạo folder nếu chưa có
    }
    cb(null, dir) // thư mục lưu file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) // unique name
  },
})

export const upload = multer({ storage })
