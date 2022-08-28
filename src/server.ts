import App from './app';
import taskController from './controllers/tasks/taskController';

const app =  new App(
    [
        /** provide array of controllers */
        new taskController()
        
    ],
    9000
)

app.listen();