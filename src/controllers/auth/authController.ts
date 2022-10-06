import * as express from "express";
import * as bcrypt from 'bcrypt';
import userModel from "../../models/user.model";
import HttpException from "../../exceptions/HttpExceptions";
import UserWithSameEmailAreadyExisitsException from "../../exceptions/UserAlreadyExistsWithSameEmailException";
import WrongCredentialsExceptioon from "../../exceptions/WrongCredentialsExceptioon";
import validationMiddleware from "../../middleware/Validation.middleware";
import UserDto from "../../dto/CreatUser.dto";
import LogInDto from "../../dto/login.dto";
import User from "../../interfaces/user.interface";
import * as jwt from 'jsonwebtoken';
import DataStoreInToken from "../../interfaces/dataStoredInToken.interface";
import TokenData from "../../interfaces/token.interface";

class AuthController{
    
    public path = "/auth";
    public router = express.Router(); 
    private user = userModel;

    constructor(){
        this.initializeRoutes();
    }

    public initializeRoutes(){
        this.router.use(`${this.path}/register`, validationMiddleware(UserDto), this.registerUser);
        this.router.use(`${this.path}/login`, validationMiddleware(LogInDto), this.loginUser);
    }

    registerUser = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const userData = request.body;
        if(await this.user.findOne({email: userData.email})){
            /** exception for same email sent in request of registration */
            next(new UserWithSameEmailAreadyExisitsException(userData.email));
        }else{
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.user.create({
                ...userData,
                password: hashedPassword
            });
            user.password = undefined;
            response.send(user);
        };
    }

    loginUser= async (request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const loginData: LogInDto = request.body;

        const user = await this.user.findOne({email: loginData.email});

        if(user){
            const isPasswordMatching = await bcrypt.compare(
                loginData.password.toString(),
                user.get('password', null, { getters: false })
            )
            if(isPasswordMatching){
                user.password = undefined;
                const tokenData = this.createToken(user);
                response.setHeader('Set-Cookie',[this.createCookie(tokenData)]);
                response.status(200).send(user);
            }else{
                next( new WrongCredentialsExceptioon());
            }
        }else{
            next(new WrongCredentialsExceptioon());
        }
    }

    createToken=(user: User)=>{
        const expiresIn = 60 * 60;
        const dataStoreInToken: DataStoreInToken = {
            _id : user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoreInToken, process.env.JWT_SECRET as string, { expiresIn })
        }
    }
    
    private createCookie=(tokenData: TokenData)=>{
        return `Autherization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}


export default AuthController;