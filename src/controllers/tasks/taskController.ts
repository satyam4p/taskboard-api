import * as express from 'express';
import task from '../../interfaces/tasks.interface';
import { data } from '../../data/tasks.json';
import taskModel from '../../models/taskModel';

class taskController{

    public path = '/tasks';

    public router = express.Router();
    private task =  taskModel;
    /**provide the tasks object */
    private tasks: task[] =[
        ...data
    ]
        
    constructor(){
        this.initializeRoutes();
    }

    public initializeRoutes(){

        this.router.get(this.path, this.getAllTasks);/** creating a get request path and collback function for it */
        this.router.post(`${this.path}/create`, this.createTask);
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
        this.task.find().then(tasks=>{
            response.send(tasks);
        })
    }   

}

export default taskController;