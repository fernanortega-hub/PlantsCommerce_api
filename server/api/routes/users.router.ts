import express from 'express';
import userController from '../controllers/user.controller';
import validateForModifyUser from '../middlewares/validateForModifyUser';

const userRouter = express
    .Router()
    .get('/', userController.getAll)
    .get('/:id', userController.getById)
    .patch('/update', [validateForModifyUser], userController.update)
    .delete('/delete', [validateForModifyUser], userController.deleteUser)

export default userRouter
