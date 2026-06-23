import mongoose from 'mongoose';
import User from './User.js';
const blogSchema = new mongoose.Schema({
    title:{
        type: "String",
        required: true,
        trim: true,
    },
    description:{
        type: "String",
        required: true,
        trim: true
    },
    author: {
        type: "String",
        required: true,
        trim: true
    },
    draft: {
        type: Boolean,
        default: false
    },
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true});
const blogModel = mongoose.model("Blog", blogSchema);

export default blogModel;

