import mongoose from "mongoose";


export interface blacklisted extends mongoose.Document {
  token: {
    type: string,
    createdAt: string
  }
}