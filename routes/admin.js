
import { Router } from 'express'
import { loginAdmin } from './../controllers/admin.js';
import { adminAuthentication } from '../middlewares/admin.js';
const router = Router()




router.post("/login",loginAdmin)
// router.post("/create", signup)



export default router