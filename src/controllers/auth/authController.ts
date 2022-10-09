import * as express from "express";
import * as bcrypt from 'bcrypt';
import userModel from "../../models/user.model";
import HttpException from "../../exceptions/HttpExceptions";
import UserWithSameEmailAreadyExisitsException from "../../exceptions/UserAlreadyExistsWithSameEmailException";
import WrongCredentialsExceptioon from "../../exceptions/WrongCredentialsExceptioon";
import validationMiddleware from "../../middleware/Validation.middleware";
import UserDto from "../../dto/CreatUser.dto";
import LogInDto from "../../dto/login.dto";
import { User } from "../../interfaces/user.interface";
import * as jwt from 'jsonwebtoken';
import DataStoreInToken from "../../interfaces/dataStoredInToken.interface";
import TokenData from "../../interfaces/token.interface";
import authMiddleware from "../../middleware/auth.middleware";
import RequestWithUser from "../../interfaces/requestWithUser.interface";

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
        this.router.use(`${this.path}/logout`, authMiddleware, validationMiddleware(LogInDto), this.logoutUser);
        this.router.use(`${this.path}/logoutAll`, authMiddleware, validationMiddleware(LogInDto), this.logoutUserFromAllSessions);
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
            const token = await user.generateAuthToken();
            user.password = undefined;
            user.tokens = undefined;
            response.send({user,token});
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
                const token = await user.generateAuthToken();
                user.password = undefined;
                user.tokens = undefined;
                response.status(200).send({user, token});
            }else{
                next( new WrongCredentialsExceptioon());
            }
        }else{
            next(new WrongCredentialsExceptioon());
        }
    }

    logoutUser= async (request: express.Request, response: express.Response)=>{
        const requestWithUser = request as RequestWithUser;
        const user = requestWithUser.user;
        const result = user.tokens?.filter(token=>token.token !== requestWithUser.token);
        user.tokens = result as User["tokens"];
        await user.save();
        response.send(200);
    }

    logoutUserFromAllSessions= async (request: express.Request, response: express.Response)=>{
        const requestWithUser = request as RequestWithUser;
        const user = requestWithUser.user;
        user.tokens = [];
        await user.save();
        response.send(200);
    }

}


export default AuthController;