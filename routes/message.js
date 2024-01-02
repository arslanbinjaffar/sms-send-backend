const { Router } = require("express")
const {uploadFile,sendMessage}=require("../controllers/Messages")
const { upload } = require("../utils/MulterStorage")
const router = Router()


router.post('/upload', upload.single('file'),uploadFile)
router.post('/sendmessage',sendMessage)

module.exports=router