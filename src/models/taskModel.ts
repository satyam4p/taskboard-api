import mongoose from "mongoose";
import task from '../interfaces/tasks.interface';

const taskSchema= new mongoose.Schema({
    "id": {type: Number, required: true, unique: true},
    "name": {type: String, required: true},
    "InitialDate": {type: String, required: true},
    "finalDate": {type: String, required: true},
    "owner": {type: String, required: true},
    "ownerId": {type: String},
    "status": {type: String, required: true},
    "description": {type: String, required: true},
});

const taskModel = mongoose.model<task & mongoose.Document>('Task',taskSchema);
/**
 * <task & mongoose.Document>, TypeScript is now aware of all the 
 * fields you defined in the interface and knows that it can expect them to be available in the post model.
 */

export default taskModel;