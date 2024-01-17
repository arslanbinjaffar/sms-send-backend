import  { Router } from "express"

// import  {uploadFile,sendMessage,bulkMessage,getGroups,uploadGroups} from "../controllers/_messages.js"
import { getGroups, sendBulkMessage, uploadGroups } from "../controllers/_messages.js"
import sendMessagesOnebyOne from '../sendmessages/sendmessage.js'
import { upload } from "../uploads/multerstorage.js"

const router = Router()


router.get('/getallgroups', getGroups)
router.post('/upload', upload.single('file'),uploadGroups)
// router.post('/upload',upload.single('file'),fetchDataAndProcess)
// router.post('/uploadFile',upload.single('file'),uploadFile)
// router.post('/sendbulkmessages',sendBulkMessage)
// router.post('/upload',uploadGroups)
// router.post('/sendbulkmessages',bulkMessage)
router.post('/sendMessages',sendMessagesOnebyOne)

export default router