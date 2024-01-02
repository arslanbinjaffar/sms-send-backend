const { default: mongoose } = require("mongoose")
exports.ConnectToMONGODB = () => {
    try {
        const URI = process.env.MONGO_URI
        mongoose.connect(URI)
        console.log("connected to mongodb")
    } catch (error) {
        console.log(error)
        console.log("connection is failed")
    }
}