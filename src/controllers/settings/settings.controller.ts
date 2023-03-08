import express, {Router} from 'express';
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import authMiddleware from '../../middleware/auth.middleware';


class SettingsController {

    public path = '/settings';
    public router = Router();

    constructor(){

        this.initializeRoutes();

    }

    initializeRoutes = () =>{

        this.router.all(`${this.path}/*`, authMiddleware)
        .get(`${this.path}/config/:id`, authMiddleware, this.getSettingsConfig)

    }

    getSettingsConfig = (request: express.Request, response: express.Response)=>{

        const user = request.params?.id;
        const requestWUser = request as RequestWithUser;
        if(user){
            const loggedInUser = requestWUser.user._id;
            const matched = user === loggedInUser;

        }

    }

}

export default SettingsController;