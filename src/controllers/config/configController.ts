import express, { Router } from "express";
import configModal from "../../models/configModal";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/Validation.middleware";
import CreateTaskConfigDTO from "../../dto/createTaskConfig.dto";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import { isObjectEqual } from "../../utils/isEquals";
import { cloneDeep } from "lodash";

class ConfigController {

    public path = "/config";
    public router = Router();
    private config = configModal;

    constructor(){
        this.initialiseRoutes();
    }
    
    initialiseRoutes=()=>{

        this.router.all(`${this.path}/*`, authMiddleware)
        /** need to create proper dto for config validation */
        .post(`${this.path}/create`, validationMiddleware(CreateTaskConfigDTO),this.createTaskConfig)
        // .post(`${this.path}/create`,this.createTaskConfig)
        .get(`${this.path}/:id`,this.getTaskConfig)

    }

    createTaskConfig= async (request: express.Request, response: express.Response)=>{
        try{
            const reqData = request.body;
            const reqWithUser = request as RequestWithUser;
            const existingConfig = await this.config.findOne({
                organisation: reqWithUser.user._id
            });
            

            if(existingConfig){
                const existingConfigClone = cloneDeep(existingConfig).toObject();
                ["_id", "organisation","__v"].forEach((prop)=>delete existingConfigClone[prop]);
                if(isObjectEqual(existingConfigClone,reqData)){
                    response.status(200).send({
                        message:"Same config already exists"
                    });
                    return;    
                }
            }
            const createdConfig = new this.config({
                ...reqData,
                organisation: reqWithUser.user._id
            });
            createdConfig.save().then(config=>{
                response.status(200).send(config);
            })
        }catch(error){
            console.log("error occured:: ",error);
            response.status(402).send({
                message:"error occured while creating config"
            })
        };
        
    }

    getTaskConfig= async (request: express.Request, response:express.Response)=>{
        try{
            const reqId = request.params.id;
        const requestedConfig = await this.config.findOne({
            organisation: reqId
        });
        response.status(200).send(requestedConfig);
        }catch(error){
            console.log(`error occured whilefeching config for org ${request.params.id}`);
            response.status(404).send("Config does not exisits");
        }   
    }
}

export default ConfigController;