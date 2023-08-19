import { Request, Response, NextFunction } from "express"
import { ResponseHandler } from "../types/types"
import { verify } from "jsonwebtoken"
import userService from "../services/user.service"
import productService from "../services/product.service"

export default async function validateForModifyProduct(
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

    if (!user.isSuccessful || user.data == null) {
        res
            .status(user.statusCode)
            .send(user)
        return
    }

    const product = await productService.getById(req.body._id)

    if (!product.isSuccessful || product.data === null) {
        unauthorizedResponse.statusCode = 500
        unauthorizedResponse.status = "Internal Server Error"
        unauthorizedResponse.message = "Cannot modify this product, try later"
        res
            .status(500)
            .send(unauthorizedResponse)
        return
    }

    if (user.data._id?.toString() !== product.data.user._id.toString()) {
        unauthorizedResponse.statusCode = 403
        unauthorizedResponse.status = "Unauthorized"
        unauthorizedResponse.message = "Unauthorized for this update"

        res
            .status(403)
            .send(unauthorizedResponse)
        return
    }

    req.body.user = user.data
    next()
}