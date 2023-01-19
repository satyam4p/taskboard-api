import * as express from "express";
import * as bcrypt from 'bcrypt';
import userModel from "../../models/user.model";
import UserWithSameEmailAreadyExisitsException from "../../exceptions/UserAlreadyExistsWithSameEmailException";
import WrongCredentialsExceptioon from "../../exceptions/WrongCredentialsExceptioon";
import validationMiddleware from "../../middleware/Validation.middleware";
import UserDto from "../../dto/CreatUser.dto";
import LogInDto from "../../dto/login.dto";
import { User } from "../../interfaces/user.interface";
import * as jwt from 'jsonwebtoken';
import DataStoreInToken from "../../interfaces/dataStoredInToken.interface";
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
        this.router.post(`${this.path}/register`, validationMiddleware(UserDto), this.registerUser);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loginUser);
        this.router.post(`${this.path}/logout`, authMiddleware, validationMiddleware(LogInDto), this.logoutUser);
        this.router.post(`${this.path}/logoutAll`, authMiddleware, validationMiddleware(LogInDto), this.logoutUserFromAllSessions);
        this.router.get(`${this.path}/refresh`, this.refreshToken);
        this.router.get(`${this.path}/me`, authMiddleware, validationMiddleware(LogInDto), this.getUser);
        this.router.get(`${this.path}/users`, authMiddleware, validationMiddleware(LogInDto), this.getUsersList);
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
                const refreshToken = jwt.sign({
                    email: user.email
                },
                process.env.REFRESH_TOKEN_SECRET as string,
                { expiresIn:  60 * 60 }
                );
                user.password = undefined;
                user.tokens = undefined;
                response.cookie('jwt',refreshToken,
                {
                    httpOnly: true,//accessible only on web server
                    secure: true, //for https
                    sameSite:'none',//cross-site cookie
                    maxAge: 60 * 60 * 1000//cookie expiry set to 1hr
                });
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

    refreshToken = async (request: express.Request, response: express.Response)=>{

        const cookies = request.cookies;
        if(!cookies?.jwt) return response.status(401).send({message: 'Unauthorized'});

        const refreshToken = cookies.jwt;
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            async (err:any, decoded:any)=>{

                if(err) return response.status(403).send({message:'forbidden'});

                const foundUser = await this.user.findOne({
                    email: decoded?.email
                });

                if(!foundUser) return response.status(401).send({message:'Unauthorized'});

                const dataStoredInToken: DataStoreInToken = {
                    _id: foundUser._id
                };
                
                const expiresIn = 60 * 60;
                const token = await foundUser.generateAuthToken();
                foundUser.tokens = undefined;
                foundUser.password = undefined;
                response.send({ user: foundUser, token });
            }
        );
    }
    getUser= async (request:express.Request, response:express.Response)=>{
        const { user } = request as RequestWithUser;
        if(user){
            user.password = undefined;
            user.tokens = undefined;
            response.send(user);
        }else{
            response.send({'message':'user not found'}).sendStatus(404);
        }
    }

    getUsersList= async ( request : express.Request, response: express.Response)=>{
        try{
            let allUsers = await this.user.find({});
            console.log("allUsers:: ",allUsers);
            const allUserNames = allUsers.map(user=>{
                return {
                    username: user.username,
                    id: user._id
                }
            });
            response.status(200).send(allUserNames);
        }catch(error){
            console.log("error occured while fetching all users:: ",error);
        }
        
    }
}


export default AuthController;