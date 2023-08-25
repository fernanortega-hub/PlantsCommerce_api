import userService from "../services/user.service";
import { Request, Response } from "express";
import { IUser, ResponseHandler } from "../types/types";
import extractToken from "../utils/extractToken";
import { verify } from "jsonwebtoken";

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

async function whoami(req: Request, res: Response) {
    try {
        const token = extractToken(req)

        const error: ResponseHandler<Error> = {
            isSuccessful: false,
            data: null,
            statusCode: 404,
            message: "User not found",
            status: "Not found"
        }

        if (!token)
            return res
                .status(404)
                .send(error)

        const payload = verify(token, process.env.JWT_TOKEN_SECRET!!)

        if (!payload)
            return res
                .status(404)
                .send(error)

        const { _id }: any = payload

        const response = await userService.getById(_id)

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

export default { register, login, whoami }