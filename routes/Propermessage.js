const { upload } = require("../utils/MulterStorage")
const { Router } = require("express")

const {uploadFile,sendMessage,bulkMessage,getGroups,uploadGroups}=require("../controllers/_messages")
const router = Router()


router.get('/getallgroups',getGroups)
router.post('/upload',uploadFile)
// router.post('/sendmessage',sendMessage)
// router.post('/upload',uploadGroups)
router.post('/sendbulkmessages',bulkMessage)

module.exports=router