import { ConnectToMONGODB } from './db.js';
import { User } from './models/user.js';


const createAdmin = async() => {
    try {
        await ConnectToMONGODB()
        const admin=await User.create({
            email: "",
            password:""
        })
        await admin.save()
        console.log("successfully created admin")
    } catch (error) {
        console.log(error)
    }
}

createAdmin()