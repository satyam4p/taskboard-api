import mongoose from "mongoose";
import task from '../interfaces/tasks.interface';

const taskSchema= new mongoose.Schema({
    taskID: Number,
    name: String,
    InitialDate: String,
    finalDate: String,
    owner: String,
    status: String,
    description: String,
});

const taskModel = mongoose.model<task & mongoose.Document>('Task',taskSchema);
/**
 * <task & mongoose.Document>, TypeScript is now aware of all the 
 * fields you defined in the interface and knows that it can expect them to be available in the post model.
 */

export default taskModel;