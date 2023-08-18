import express from 'express';
import userController from '../controllers/user.controller';
import validateForUpdateUser from '../middlewares/validateForUpdateUser';

const userRouter = express
    .Router()
    .get('/', userController.getAll)
    .get('/:id', userController.getById)
    .patch('/update', [validateForUpdateUser], userController.update)

export default userRouter
