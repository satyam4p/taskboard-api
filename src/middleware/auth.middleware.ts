import * as express from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import * as jwt from 'jsonwebtoken';
import DataStoreInToken from '../interfaces/dataStoredInToken.interface';
import userModel from '../models/user.model';
import WrongAuthenticationTokenException from '../exceptions/wrongAuthenticationTokenException';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';


async function authMiddleware(request: express.Request, response: express.Response, next: express.NextFunction){
    const requestWithUser = request as RequestWithUser;
    const cookies = requestWithUser.cookies;
    if(cookies){
        const secret = process.env.JWT_SECRET;
        try{
            const verificationResponse = jwt.verify(cookies.Autherization, secret as string) as DataStoreInToken;
            const id = verificationResponse._id;
            const user = await userModel.findById(id);
            console.log("user:: ",user);
            if(user){
                requestWithUser.user = user;
                next();
            }else{
                next(new WrongAuthenticationTokenException());
            }
        }catch(error){
            next(new WrongAuthenticationTokenException);
        }
    }else{
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;