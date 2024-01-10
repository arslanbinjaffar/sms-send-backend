import { User } from '../models/user.js';

export const adminAuthentication = async (req, res, next) => {
    try {
        const { email } = req.body;
        const admin = await User.findOne({ email });

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized access", message: "You do not have permission to access this resource" });
        }

        next();
    } catch (error) {
        next(error);
    }
};
