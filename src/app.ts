import express, { Express, Request, Response  } from "express";

const app = express();

const port = 9000;

app.get('/',(req: Request, res: Response)=>{
    res.send('taskboard api');
})

app.listen(port,()=>{
    console.log(`api is running on port ${port}`);
});

module.exports = app;