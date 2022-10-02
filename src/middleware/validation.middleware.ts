import { plainToInstance } from "class-transformer";
import * as express from 'express';
import { validate, ValidationError,  } from 'class-validator';
import HttpException from "../exceptions/HttpExceptions";

function validationMiddleware<T>(type:any):express.RequestHandler {
    return (req, res, next)=>{
        validate(plainToInstance(type, req.body), { skipMissingProperties: true})
            .then((errors:ValidationError[])=>{
                if(errors.length > 0){
                    const message = errors.map((error:ValidationError)=> {
                        let errorString: string = `${error.property} error:`;
                        for (let constraint in error.constraints) {
                            
                            if (!error.constraints.hasOwnProperty(constraint)) {
                                continue;
                            }
                            errorString += ` - ${error.constraints[constraint]}\n  `;
                        }
                        return errorString
                    }).join(",");
                    console.log("message:: ",message);
                    next(new HttpException(400, message));
                } else{
                    next();
                }
            });
    }
}

export default validationMiddleware;