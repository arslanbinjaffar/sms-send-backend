import  { Router } from "express"

// import  {uploadFile,sendMessage,bulkMessage,getGroups,uploadGroups} from "../controllers/_messages.js"
import  {fetchDataAndProcess, getGroups} from "../controllers/_messages.js"

const router = Router()


router.get('/getallgroups',getGroups)
router.post('/upload',fetchDataAndProcess)
// router.post('/sendmessage',sendMessage)
// router.post('/upload',uploadGroups)
// router.post('/sendbulkmessages',bulkMessage)

export default router