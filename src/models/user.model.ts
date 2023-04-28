import * as mongoose from 'mongoose';
import { User, UserMethods} from '../interfaces/user.interface';
import * as jwt from 'jsonwebtoken';
import DataStoreInToken from '../interfaces/dataStoredInToken.interface';

const userSchema  = new mongoose.Schema({
    username: {type: String, required:true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true, unique: true},
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    role:{type: String, required: true}
});

userSchema.methods.generateAuthToken = async function (){
    const expiresIn = 60 * 60;
    const user = this;
    const dataStoreInToken: DataStoreInToken = {
        _id : user._id,
    };
    const token = jwt.sign(dataStoreInToken, process.env.JWT_SECRET as string, { expiresIn });
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;

}

const userModel = mongoose.model<User & mongoose.Document & UserMethods>('User', userSchema);

export default userModel;