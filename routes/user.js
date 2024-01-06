import { authentication } from "../middlewares/auth.js"
import {logIn,signUp} from "../controllers/user.js"
import {Router}from "express"
const router = Router()


router.post("/signup",signUp)
router.post("/login", authentication, logIn)

export default router
