import express from 'express';
import authController from '../controllers/auth.controller';

const authRouter = express
    .Router()
    .post('/register', authController.register)
    .post('/login', authController.login)

export default authRouter
