import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../types/types";
import userService from "../services/user.service";

export default async function validateForUpdateUser(
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
    const { id }: any = payload

    const user = await userService.getById(id)

    if(!user.isSuccessful || user.data == null) {
        res
            .status(user.statusCode)
            .send(user)
        return
    }


    if(user.data.id !== req.body.id && user.data.role !== "admin") {
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