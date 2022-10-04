import * as express from "express";
import * as bcrypt from 'bcrypt';
import userModel from "../../models/user.model";
import HttpException from "../../exceptions/HttpExceptions";
import UserWithSameEmailAreadyExisitsException from "../../exceptions/UserAlreadyExistsWithSameEmailException";
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

    public initializeRoutes(){
        this.router.use(`${this.path}/register`, validationMiddleware(UserDto), this.registerUser);
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
            user.password = "";
            response.send(user);
        };
    }
}


export default AuthController;