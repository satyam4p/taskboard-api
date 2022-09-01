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
        this.router.delete("/tasks/delete", this.deleteTask);
    }

    createTask=(request: express.Request, response: express.Response)=>{
        const reqData = request.body;
        const createdTask = new this.task(reqData);
        createdTask.save().then(task=>{
            console.log("created task:: ",task);
            response.send(task);
        });
    }

    getAllTasks=(request: express.Request, response: express.Response)=>{
        console.log("delete request made")
        this.task.find().then(tasks=>{
            response.send(tasks);
        })
    }
    
    deleteTask=(request: express.Request, response: express.Response)=>{
        console.log("delete request made")
        const id = request.params.id;
        console.log("id is:: ",id);
        


    }

}

export default taskController;