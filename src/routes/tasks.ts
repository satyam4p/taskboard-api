import express, { Express, Request, Response, Router } from 'express';
import { request } from 'http';
import tasks from '../data/tasks.json';
const tasksRouter = Router();

tasksRouter.get('/getTasks',(request, response)=>{
    return response.json(tasks.data);
})

export default tasksRouter;