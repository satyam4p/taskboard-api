import * as express from 'express';
import task from './tasks.interface';
import { data } from '../../data/tasks.json';


class taskController{

    public path = '/tasks';

    public router = express.Router();

    /**provide the tasks object */
    private tasks: task[] =[
        ...data
    ]
        
    
    constructor(){
        this.initializeRoutes();
    }

    public initializeRoutes(){
        this.router.get(this.path, this.getAllTasks);/** creating a get request path and collback function for it */
    }

    getAllTasks=(request: express.Request, response: express.Response)=>{
        console.log("tasks:: ", this.tasks);
        response.send(this.tasks);

    }   

}

export default taskController;