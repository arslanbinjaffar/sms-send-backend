const { upload } = require("../utils/MulterStorage")
const { Router } = require("express")

const {uploadFile,sendMessage,bulkMessage,getGroups}=require("../controllers/messages.js")
const router = Router()


router.post('/upload',upload.single('file'),uploadFile)
// router.post('/sendmessage',sendMessage)
router.get('/getallgroups',getGroups)
router.post('/sendbulkmessages',bulkMessage)

module.exports=router