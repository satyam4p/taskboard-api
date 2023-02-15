import * as express from "express"
import authMiddleware from '../../middleware/auth.middleware';
import validationMiddleware from "../../middleware/validation.middleware";
import taskModel from "../../models/taskModel";
import userModel from "../../models/user.model";

class ChoicesController{

    public path = "/choices"
    public router = express.Router();

    private task = taskModel;
    private user = userModel
    constructor(){
        this.initializeRoutes();
    }

    public initializeRoutes = ()=>{
        this.router.all(`${this.path}/*`, authMiddleware)
        .get(`${this.path}`, this.getQueryParams)
    }

    getQueryParams = (request: express.Request, response: express.Response, next: express.NextFunction )=>{
        const queryParam = request.query?.entityKey;
        if(queryParam == "assignee"){
            const callback = (error: any, result: any)=>{
                if(error){
                    response.status(401).send({
                        message: "something went wrong while fetching users",
                        error
                    });
                }else{
                    const assignableUsersList = result.map((user: { username: any; _id: any; })=>{
                        return {
                            username: user.username,
                            id: user._id
                        }
                    });
                    response.status(200).send(assignableUsersList);
                }
            }
            this.user.find({},callback);
        }
    }

}

export default ChoicesController;