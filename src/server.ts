import App from './app';
import taskController from './controllers/tasks/taskController';
import 'dotenv/config';
import validateEnv from './utils/validateEnv';

const { MONGO_USER, MONGO_PASSWORD, PORT, MONGO_PATH } = process.env;

const app =  new App(
    [
        /** provide array of controllers */
        new taskController()
        
    ]
)

app.listen();