import userService from "../services/user.service";
import { Request, Response } from "express";
import { IUser, ResponseHandler } from "../types/types";

async function register(req: Request, res: Response) {
    try {
        const user: IUser = req.body
        const response = await userService.registerUser(user)
        return res
            .status(response.statusCode)
            .json(response)
    } catch (error) {
        const resError: ResponseHandler<Error> = {
            isSuccessful: false,
            data: null,
            statusCode: error.statusCode ?? 500,
            message: error.message,
            status: error.message
        }

        return resError
    }
}

async function login(req: Request, res: Response) {
    try {
        const { email, password }: { email: string, password: string } = req.body
        const response = await userService.login(email, password)

        return res
            .status(response.statusCode)
            .json(response)

    } catch (error) {
        const resError: ResponseHandler<Error> = {
            isSuccessful: false,
            data: null,
            statusCode: error.statusCode ?? 500,
            message: error.message,
            status: error.message
        }

        return res
            .status(error.statusCode ?? 500)
            .send(resError) 
    }
}

export default { register, login }