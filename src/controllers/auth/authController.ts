import * as express from "express";
import * as bcrypt from 'bcrypt';
import userModel from "../../models/user.model";
import HttpException from "../../exceptions/HttpExceptions";
import validationMiddleware from "../../middleware/Validation.middleware";
import UserDto from "../../dto/CreatUser.dto";
import LogInDto from "../../dto/login.dto";

class AuthController{
    
    public path = "/auth";
    
    public router = express.Router(); 

    private user = userModel;

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.use(`${this.path}/register`, validationMiddleware(UserDto), this.registerUser);
    }

    private async registerUser(request: express.Request, response: express.Response, next: express.NextFunction){

        const userData = request.body;

        if(await this.user.findOne({email: userData.email})){
            next()//provide the middleware for exception of user alerady exists
        }else{
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.user.create({
                ...userData,
                password: hashedPassword
            });
            user.password = "";
            response.send(user);
        };

    }




}


export default AuthController;