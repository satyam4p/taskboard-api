import mongoose from "mongoose";
import tracker from "../interfaces/tracker.interface";

const trackerSchema = new mongoose.Schema({
  host: { type: String, required: true },
  fprint: { type: String, required: true },
  timezone: { type: String, required: true },
  time: { type: String, required: true },
});

const trackerModal = mongoose.model<tracker & mongoose.Document>(
  "Tracker",
  trackerSchema
);

export default trackerModal;
