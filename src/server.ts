import App from './app';
import taskController from './controllers/tasks/taskController';
import AuthController from './controllers/auth/authController';
import 'dotenv/config';
import validateEnv from './utils/validateEnv';

const { MONGO_USER, MONGO_PASSWORD, PORT, MONGO_PATH } = process.env;

const app =  new App(
    [
        /** provide array of controllers */
        new taskController(),
        new AuthController()
        
    ]
)

app.listen();