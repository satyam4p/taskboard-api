import express, { Express, Request, Response  } from "express";
import useRouter from "./routes";
import * as bodyParser from 'body-parser';
import mongoose from "mongoose";
const cors = require('cors');
class App{
    public app: express.Application;

    constructor(controllers: any){
        this.app = express();

        this.initializeMiddlewares();
        this.connectToDatabase();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }
    
    private initializeControllers(controllers: any[]){
        controllers.forEach((controller)=>{
            this.app.use('/',controller.router);
        })
    }

    public listen(){
        this.app.listen(process.env.PORT,()=>`App is listening at port ${process.env.PORT}`);
    }

    private connectToDatabase(){
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        
        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`).then(res=>{
            console.log("Connected to MongoDB, Ready for use.")
        }, error=>{
            console.log("Foloowing error occured during DB connection: ",error);
        });
    }   
}



export default App;