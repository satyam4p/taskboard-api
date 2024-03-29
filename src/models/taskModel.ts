import mongoose from "mongoose";
import task from '../interfaces/tasks.interface';

const taskSchema= new mongoose.Schema({
    "name": {type: String, required: true},
    "InitialDate": {type: String },
    "finalDate": {type: String },
    "ownerId": {type: mongoose.Schema.Types.ObjectId,
            ref:'User'},
    "status": {type: String, required: true},
    "description": {type: String, required: true},
    "assignee": {type: mongoose.Schema.Types.ObjectId,
            ref:'User'},
    "label": {type: String},
    "createdAt":{type: Date, default: Date.now}
});

const taskModel = mongoose.model<task & mongoose.Document>('Task',taskSchema);
/**
 * <task & mongoose.Document>, TypeScript is now aware of all the 
 * fields you defined in the interface and knows that it can expect them to be available in the post model.
 */

export default taskModel;