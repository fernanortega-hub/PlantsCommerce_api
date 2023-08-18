import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../types/types";

export default function validateUser(
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


    verify(token, process.env.JWT_TOKEN_SECRET!!, function (err) {
        if (err) {
            unauthorizedResponse.message = err.message
            res
                .status(403)
                .send(unauthorizedResponse)
        } else {
            next()
        }
    })
}