import App from './app';
import taskController from './controllers/tasks/taskController';
import AuthController from './controllers/auth/authController';
import ConfigController from './controllers/config/configController';
import CommentsController from './controllers/comments/commentsController';
import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import ChoicesController from './controllers/choices/ChoicesController';
import UserProfile from './controllers/profile/userProfile';

const { MONGO_USER, MONGO_PASSWORD, PORT, MONGO_PATH } = process.env;

const app =  new App(
    [
        /** provide array of controllers */
        new taskController(),
        new AuthController(),
        new ConfigController(),
        new CommentsController(),
        new ChoicesController(),
        new UserProfile()
    ]
)

app.listen();