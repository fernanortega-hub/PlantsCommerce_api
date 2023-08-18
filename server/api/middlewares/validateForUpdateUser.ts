import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../types/types";
import userService from "../services/user.service";

/**
 * 
 * middleware para validar dos cosas, si el usuario que desea modificar a otro es el mismo ó si es administrador
 */
export default async function validateForModifyUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const unauthorizedResponse: ResponseHandler<string | null> = {
        isSuccessful: false,
        data: null,
        status: 'Unauthorized',
        statusCode: 403,
        message: 'Unauthorized user'
    }

    const auth = req.headers.authorization ?? null

    if (auth == null) {
        res
            .status(403)
            .send(unauthorizedResponse)
        return
    }


    const [bearer, token] = auth.split(' ')

    if (bearer.trim().length === 0 || token.trim().length === 0) {
        res
            .status(403)
            .send(unauthorizedResponse)
        return
    }


    const payload = verify(token, process.env.JWT_TOKEN_SECRET!!)

    if (!payload) {
        res
            .status(403)
            .send(unauthorizedResponse)
        return
    }
    const { _id }: any = payload

    const user = await userService.getById(_id)

    if(!user.isSuccessful || user.data == null) {
        res
            .status(user.statusCode)
            .send(user)
        return
    }


    if(user.data.role === "admin") {
        next()
        return
    }

    console.log(typeof req.body.role)

    if(typeof req.body.role !== undefined) {
        unauthorizedResponse.statusCode = 403
        unauthorizedResponse.status = "Unauthorized"
        unauthorizedResponse.message = "Unauthorized for this update"

        res
            .status(403)
            .send(unauthorizedResponse)
        return
    }

    if(user.data._id?.toString() !== req.body._id) {
        unauthorizedResponse.statusCode = 403
        unauthorizedResponse.status = "Unauthorized"
        unauthorizedResponse.message = "Unauthorized for this update"

        res
            .status(403)
            .send(unauthorizedResponse)
        return
    }

    next()
}