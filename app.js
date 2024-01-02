const userRouter = require("./routes/user")
const MessageRouter=require("./routes/message")
const { ConnectToMONGODB } = require("./db")
const dotenv = require("dotenv")
const express = require("express")
dotenv.config()
ConnectToMONGODB()
const app = express()
app.use(cors())
app.use(express.json({ limit: '25mb' }));

app.use('/user', userRouter)
app.use('/file',MessageRouter)
app.get('/', async (req,res) => {
    res.send('hello world')
})


const port=process.env.PORT || 3000
app.listen(port, () => {
    console.log(`https://localhost:${port}`)
})