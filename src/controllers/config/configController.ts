import { Router } from "express";
import configModal from "../../models/configModal";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/Validation.middleware";
import CreateTaskConfigDTO from "../../dto/createTaskConfig.dto";

class ConfigController {

    public path = "config";
    public router = Router();
    private config = configModal;

    constructor(){
        this.initialiseRoutes();
    }
    
    initialiseRoutes=()=>{

        this.router.all(`${this.path}/*`, authMiddleware)
        .post(`${this.path}/create`, validationMiddleware(CreateTaskConfigDTO),this.createTaskConfig)
        .get(`${this.path}/:id`,this.getTaskConfig)

    }

    createTaskConfig=(request: Express.Request, response: Express.Response)=>{



    }

    getTaskConfig=(request: Express.Request, response:Express.Response)=>{



    }

}

export default ConfigController;