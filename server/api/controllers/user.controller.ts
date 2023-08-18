import userService from "../services/user.service";
import { Request, Response, response } from "express";
import { ResponseHandler } from "../types/types";
import { IUser } from "../types/types";

const resError = (error: any): ResponseHandler<Error> => {
    return {
        isSuccessful: false,
        data: null,
        statusCode: error.statusCode ?? 500,
        message: error.message,
        status: error.message,
    }
}

async function getAll(req: Request<{}, {}, {}, any>, res: Response) {
    try {
        const { limit } = req.query

        const response = await userService.getAll(parseInt(limit ?? '10'))

        return res
            .status(response.statusCode)
            .json(response)
    } catch (error) {
        return res
            .status(error.statusCode ?? 500)
            .send(resError(error))
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
        return res
            .status(error.statusCode ?? 500)
            .send(resError(error))
    }
}

async function update(req: Request, res: Response) {
    try {
        const user: IUser = req.body
    
        const response = await userService.updateUser(user)

        return res
            .status(response.statusCode)
            .send(response)

    } catch (error) {
        return res
            .status(error.statusCode ?? 500)
            .send(resError(error))
    }
}

async function deleteUser(req: Request, res: Response) {
    try {
        const { id }: any = req.body
    
        const response = await userService.deleteUser(id)

        return res
            .status(response.statusCode)
            .send(response)

    } catch (error) {
        return res
            .status(error.statusCode ?? 500)
            .send(resError(error))
    }
}

export default { getAll, getById, update, deleteUser }