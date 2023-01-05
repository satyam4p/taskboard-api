import mongoose ,{ Schema } from "mongoose";

import taskConfigInterface from "../interfaces/taskConfig.Interface";


const taskConfigSchema = new Schema({
    name:{
        entityKey:{type:String, required:true},
        entityType: {type:String, required:true},
        label: {type:String, required:true},
        visible: {type:Boolean, required:true},
    },
    status:{
        entityKey:{type:String, required:true},
        entityType: {type:String, required:true},
        label: {type:String, required:true},
        visible: {type:Boolean, required:true},
    },
    label:{
        entityKey:{type:String, required:true},
        entityType: {type:String, required:true},
        label: {type:String, required:true},
        visible: {type:Boolean, required:true},
    },
    description:{
        entityKey:{type:String, required:true},
        entityType: {type:String, required:true},
        label: {type:String, required:true},
        visible: {type:Boolean, required:true},
    },
    assignee:{
        entityKey:{type:String, required:true},
        entityType: {type:String, required:true},
        label: {type:String, required:true},
        visible: {type:Boolean, required:true},
    }
});

const configModal = mongoose.model<taskConfigInterface & mongoose.Document>('Config', taskConfigSchema);

export default configModal;


