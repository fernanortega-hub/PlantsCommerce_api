import express from 'express';
import userController from '../controllers/user.controller';
import validateUser from '../middlewares/validateuser';

const userRouter = express
    .Router()
    .get('/', [validateUser] ,userController.getAll)
    .get('/:id',[validateUser], userController.getById)

export default userRouter
