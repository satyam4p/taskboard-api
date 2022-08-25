import express, { Router } from 'express';
import tasksRouter  from './tasks';
const useRouter = Router();

useRouter.use('/tasks', tasksRouter);

export default useRouter;