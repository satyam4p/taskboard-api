import * as express from 'express';
import task from '../../interfaces/tasks.interface';
import { data } from '../../data/tasks.json';
import taskModel from '../../models/taskModel';

class taskController{

    public path = '/tasks';
    public router = express.Router();
    private task =  taskModel;

    constructor(){
        this.initializeRoutes();
        console.log("routes initialized")
    }

    public initializeRoutes(){

        this.router.get(this.path, this.getAllTasks);/** creating a get request path and collback function for it */
        this.router.post(`${this.path}/create`, this.createTask);
        this.router.delete("/tasks/delete/:id", this.deleteTask);
    }

    createTask=(request: express.Request, response: express.Response)=>{
        try{
            const reqData = request.body;
            const createdTask = new this.task(reqData);
            createdTask.save().then(task=>{
            response.send(task);
        });
        }catch(error){
            console.log("Error in creating task:: ",error);
            response.status(401).send("Some Error Occurred");
        };
        
    }

    getAllTasks=(request: express.Request, response: express.Response)=>{
        try{
            this.task.find().then(tasks=>{
                response.status(200).send(tasks);
            })
        }catch(error){
            console.log("Error in fetching all tasks:: ",error);
            response.status(401).send({
                "message":"Some error occured"
            })
        }
    }
    
    deleteTask=async (request: express.Request, response: express.Response)=>{
        try{
            const id = request.params.id;
            const returnedTask = await this.task.findOneAndDelete({
                id: id
            })
            response.status(200).send({
                "message": "Task Successfully deleted",
            });
        }catch(error){
            console.log("Error in deleting tasks:: ",error);
            response.status(401).send({
                "message":"Some error occured"
            })
        }
        
    }


}

export default taskController;