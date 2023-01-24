import mongoose, { Schema } from "mongoose";
import { comments } from "../interfaces/comments.interface";

const commentsSchema = new Schema({
    body: {type: String, required: true},
    user: {
        username: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId,
            ref:'User' , required: true},
    },
    taskId: { type: mongoose.Schema.Types.ObjectId,
        ref:'Task' , required: true},
})

const commentsModal = mongoose.model< comments & mongoose.Document>('Comments', commentsSchema );

export default commentsModal;