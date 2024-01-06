import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    users:{
        type:Array,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default:true
    }
});

export const Messages = model("messages", messageSchema);