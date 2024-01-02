const { Schema, model } = require("mongoose");

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

exports.Messages = model("messages", messageSchema);