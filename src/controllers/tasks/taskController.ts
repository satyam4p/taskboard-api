import * as express from 'express';
import task from '../../interfaces/tasks.interface';
import taskModel from '../../models/taskModel';
import HttpException from '../../exceptions/HttpExceptions';
import validationMiddleware from '../../middleware/validation.middleware';
import CreateTaskDto from '../../dto/CreateTask.dto';
import authMiddleware from '../../middleware/auth.middleware';
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import userModel from '../../models/user.model';
import nodemailer from 'nodemailer';
import { SendEmail } from '../../helperServices/GenerateEmail';
// import getAWSCreds from '../profile/userProfile';
class taskController{

    public path = "/tasks";
    public router = express.Router();
    private task =  taskModel;
    private user = userModel;
    constructor(){
        this.initializeRoutes();
    }

    public initializeRoutes(){
        
        /** creating a get request path and collback function for it */
        /**adding validationmiddleware to validate the  incoming create request with dto class */
        // this.router.post(`${this.path}/create`, validationMiddleware(CreateTaskDto), this.createTask);
        //need to create dto class for following routes
        this.router.all(`${this.path}/*`,authMiddleware)
        .patch(`${this.path}/updateStatus/:id`, validationMiddleware(CreateTaskDto), this.updateTaskStatus)
        .delete("/tasks/delete/:id",authMiddleware, this.deleteTask)
        .post(`${this.path}/create`, authMiddleware, validationMiddleware(CreateTaskDto), this.createTask)
        .get(this.path, this.getAllTasks)
        .get(`${this.path}/recent`,this.getRecentTasks)
        .get(`${this.path}/:id`, this.getTask)
        // this.router.patch(`${this.path}/updateStatus/:id`, validationMiddleware(CreateTaskDto), this.updateTaskStatus);
        // this.router.delete("/tasks/delete/:id", this.deleteTask);
    }

    createTask= (request: express.Request, response: express.Response)=>{
        try{

            const reqData = request.body;
            const requestUser = request as RequestWithUser;
            const createdTask = new this.task({
                ...reqData,
                ownerId: requestUser.user._id
            });
            createdTask.save().then(async task=>{
                const assignee = await this.user.findById({
                    _id: reqData.assignee
                });
                if(assignee){
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.ethereal.email',
                        port: 587,
                        auth: {
                            user: 'teagan.brown4@ethereal.email',
                            pass: 'wgFHvXWAcFd323A47K'
                        }
                    });
                    let mailOptions = {
                        from:'<teagan.brown4@ethereal.email>',
                        to:'satyamkumar343@gmail.com',
                        subject:'taskboard testing',
                        text:'confirmation email'
                    };
                    
                }
                response.send(task);
        }).catch(error=>{
            response.status(400).send({
                "message":"Error occured",
                "error":error
            })
        });
        }catch(error){
            console.log("Error in creating task:: ",error);
            response.status(401).send("Some Error Occurred");
        };
    }

    getTask = (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        try{
            const taskId = request.params.id;
            this.task.findById({
                _id: taskId
            }, (error: any, task: task)=>{
                if(error){
                    response.status(404).send({
                        message: "task not found",
                        error
                    })
                }else{
                    response.status(200).send(task);
                }
            })
        }catch(error){
            next(new HttpException(401,"Something went wrong"));
        }
    }

    getAllTasks= async (request: express.Request, response: express.Response)=>{
        try{
            // getAWSCreds();
            const tasks = await this.task.aggregate(
                [
                    {
                        $lookup:{
                            from: 'users',
                            localField: 'assignee',
                            foreignField: '_id',
                            as: 'username'
                        }
                    }
                ]
            )
            if(tasks){
                tasks.reduce((acc, task)=>{
                    task['assignee'] = task?.username[0]?.username;
                    delete task.username;
                    acc.push(task);
                    return acc;
                },[]);
                response.status(200).send(tasks);
            }

        }catch(error){
            response.status(500).send({
                "message":"Some error occured"
            })
        }
    }

    updateTaskStatus = async (request: express.Request, response:express.Response, next:express.NextFunction) =>{
        try{
            const id = request.params.id;
            let queryResponse = await this.task.findByIdAndUpdate({
                _id: id
                },
                {...request.body}
            );
            if(queryResponse){
                this.task.findById(id, (_error: any, _result: any)=>{
                    if(_error){
                        response.status(402).send({
                            message:"some error occured while getting updated task"
                        });
                    }else{
                        console.log("resut:: ",_result);
                        response.status(200).send(_result);
                    }   
                });
            }else{
                next(new HttpException(404,"Task not found"));    
            }
        }catch(error){
            next(new HttpException(500,"Something went wrong"));
        }
    }
    
    deleteTask = async (request: express.Request, response: express.Response, next:express.NextFunction)=>{
        const id = request.params.id;
        const returnedTask = await this.task.findByIdAndDelete({
            _id: id
        });
        if(returnedTask){
            response.status(200).send({
                "message": "Task Successfully deleted",
            });
        }else{
            next(new HttpException(400, 'Some error occured'));
        }
    }

    getRecentTasks = (request: express.Request, response: express.Response) =>{

        const requestWUser = request as RequestWithUser;

        const assignee = requestWUser.user._id;
        const assignedTasks = this.task.find({
            assignee
        })
        .limit(20).sort({createdAt: -1})
        .exec((error: any, tasks: Array<task>)=>{
            if(error){
                response.status(500).send({
                    message:"some error occured while fetching tasks"
                });
            }else{
                response.status(200).send(tasks);
            }
        })
    }
}

export default taskController;