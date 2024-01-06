import  { upload } from "../utils/MulterStorage.js"
import  { Router } from "express"

// import  {uploadFile,sendMessage,bulkMessage,getGroups,uploadGroups} from "../controllers/_messages.js"
import  {getGroups} from "../controllers/_messages.js"

const router = Router()


router.get('/getallgroups',getGroups)
// router.post('/upload',uploadFile)
// router.post('/sendmessage',sendMessage)
// router.post('/upload',uploadGroups)
// router.post('/sendbulkmessages',bulkMessage)

export default router