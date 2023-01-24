import mongoose from "mongoose";


export interface comments extends mongoose.Document{
    _id: string,
    body: string,
    user: {
        username: string,
        userId: string
    },
    taskId: string

}