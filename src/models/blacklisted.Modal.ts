import mongoose from "mongoose";
import { blacklisted } from "../interfaces/blacklisted.interface";


const blacklistedSchema = new mongoose.Schema({
  token: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
})

const blacklistedModal = mongoose.model<blacklisted & mongoose.Document>('BlackListed', blacklistedSchema);

export default blacklistedModal;
