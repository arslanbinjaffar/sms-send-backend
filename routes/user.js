const { authentication } = require("../middlewares/auth")
const {logIn,signUp}=require("../controllers/user")
const {Router}=require("express")
const router = Router()


router.post("/signup",signUp)
router.post("/login", authentication, logIn)



module.exports=router