import express, { Express, Request, Response  } from "express";
import useRouter from "./routes";
import * as bodyParser from 'body-parser';

class App{
    public app: express.Application;

    constructor(controllers: any){
        this.app = express();

        // this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares(){
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers: any[]){
        controllers.forEach((controller)=>{
            this.app.use('/',controller.router);
        })
    }

    public listen(){
        this.app.listen(process.env.PORT,()=>`App is listening at port ${process.env.PORT}`);
    }

}
// const app = express();

// const port = 9000;

// // app.get('/',(req: Request, res: Response)=>{
// //     res.send('taskboard api');
// // })
// app.use(useRouter);
// app.listen(port,()=>{
//     console.log(`api is running on port ${port}`);
// });



export default App;