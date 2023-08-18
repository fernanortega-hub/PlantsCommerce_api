import userService from "../services/user.service";
import { Request, Response } from "express";
import { ResponseHandler } from "../types/types";

async function getAll(req: Request<{}, {}, {}, any>, res: Response) {
    try {
        const { limit } = req.query

        const response = await userService.getAll(parseInt(limit ?? '10'))

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

async function getById(req: Request<{}, {}, {}, string>, res: Response) {
    try {
        const id = req.query

        const response = await userService.getById(id)

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

export default { getAll, getById }