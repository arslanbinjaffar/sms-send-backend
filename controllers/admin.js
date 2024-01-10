
import { User } from './../models/user.js';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email },{email:1,role:1});
        if (admin) {

            const token = jwt.sign(
                { email: admin.email, role: admin.role }, 
                'your-secret-key', 
                { expiresIn: '1h' } 
            );
            res.status(200).json({ message: 'Login successful', token, user: admin });
        } else {
            res.status(404).json({ error: 'Admin not found', message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Internal server error', message: 'An unexpected error occurred' });
    }
};


// export const signup = async (req, res) => {
//     try {
//         const admin = await User.create({
//             email: "hairspala@serum.com",
//             password: "Donpeso103$$$1",
//             role:"admin"
//         })
//         await admin.save()
//         console.log(admin)
//     } catch (error) {
//         console.log(error)
//     }
// }