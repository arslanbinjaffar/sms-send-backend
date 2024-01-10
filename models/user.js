import { Schema, model } from "mongoose";

const userRoles = ['user', 'admin', 'moderator'];

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: userRoles
    }
});



export const User = model("users", userSchema);
