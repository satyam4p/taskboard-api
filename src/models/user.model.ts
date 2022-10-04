import * as mongoose from 'mongoose';
import User from '../interfaces/user.interface';

const userSchema  = new mongoose.Schema({
    username: {type: String, required:true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true, unique: true}
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;