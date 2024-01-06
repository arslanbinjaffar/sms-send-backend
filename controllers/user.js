import jwt from "jsonwebtoken";
import { User }  from  "../models/user.js";
export const signUp = async (req,res) => {
    try {
        const {
            email,
            password,
        } = req.body;
            const newUser = await User.create({
                email,
                password,
                })
        const user = await newUser.save();
        const secret=process.env.JWT_SCERET || ""
        const payload = {
            email,
            password,
        }
        const token =jwt.sign(payload, secret, { expiresIn: "1hr" })
        res.status(200).json({
            message: "signUp User successfully", success: true, result: true, result: {
           email,token
        }})
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error", error: error.message });
        } else if (error.name === "MongoError" && error.code === 11000) {
            return res.status(409).json({ message: "Duplicate key error", error: error.message });
        }
        res.status(500).json({ message: "Internal server error"+error });
    }
}
// exports.signUp = async (req,res) => {
//     try {
//         const {
//             email,
//             password,
//         } = req.body;
//         console.log(req.body)
//             const newUser = await User.create({
//                 email,
//                 password,
//             })
//             const user = await newUser.save();
//         console.log(user)
//         const token =jwt.sign(payload, secret, { expiresIn: "1hr" })
//         res.status(200).json({
//             message: "signUp User successfully", success: true, result: true, data: {
//            email,token
//         }})
//     } catch (error) {
//         if (error.name === "ValidationError") {
//                         return res.status(400).json({ message: "Validation error", error: error.message });
//                     } else if (error.name === "MongoError" && error.code === 11000) {
//                         return res.status(409).json({ message: "Duplicate key error", error: error.message });
//                     }
//                     res.status(500).json({ message: "Internal server error"+error });
//     }
// }
export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const authorizeHeader = req.headers.authorization;

        if (!authorizeHeader || !authorizeHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
        }

        const token = authorizeHeader.split(' ')[1];
        const secret = process.env.JWT_SCERET || '';

        const authorizeInfo = await jwt.verify(token, secret);

        if (email === authorizeInfo.email && password === authorizeInfo.password) {
            const user = await User.findOne({ email: authorizeInfo.email, password: authorizeInfo.password });

            if (user) {
                return res.status(200).json({ message: 'Successfully logged in user', data: user });
            } else {
                return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
            }
        } else {
            return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};