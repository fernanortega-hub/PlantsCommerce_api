import { Request, Response } from "express";
import { IProduct, ResponseHandler } from "../types/types";
import productService from "../services/product.service";
import { verify } from "jsonwebtoken";
import { HttpError } from "express-openapi-validator/dist/framework/types";

const resError = (error: any): ResponseHandler<Error> => {
    return {
        isSuccessful: false,
        data: null,
        statusCode: error.statusCode ?? 500,
        message: error.message,
        status: error.message,
    }
}

async function create(req: Request, res: Response) {
    try {
        const unauthorizedResponse: ResponseHandler<string | null> = {
            isSuccessful: false,
            data: null,
            status: 'Unauthorized',
            statusCode: 403,
            message: 'Unauthorized user'
        }
    
        const auth = req.headers.authorization ?? null
    
        if (auth == null) {
            return res
            .status(403)
            .send(unauthorizedResponse)
        }
    
    
        const [bearer, token] = auth.split(' ')
    
        if (bearer.trim().length === 0 || token.trim().length === 0) 
            return res
                .status(403)
                .send(unauthorizedResponse)
            
        const payload = verify(token, process.env.JWT_TOKEN_SECRET!!)

        if (!payload) 
            return res
            .status(403)
            .send(unauthorizedResponse)

        
        const { _id }: any = payload

        const product: IProduct = req.body
        product.user = _id

        const response = await productService.createProduct(product)

        return res
            .status(response.statusCode)
            .send(response)
    } catch (error) {
        const newError = resError(error)

        return res
            .status(newError.statusCode)
            .send(newError)
    }
}

async function getAll(req: Request, res: Response) {
    try {
        const { limit }: any = req.query

        const response = await productService.getAll(parseInt(limit ?? '10'))

        return res
            .status(response.statusCode)
            .send(response)

    } catch (error) {
        const newError = resError(error)

        return res
            .status(newError.statusCode)
            .send(newError)
    }
}

async function updateProduct(req: Request, res: Response) {
    try {
        const product: IProduct = req.body
    
        const response = await productService.updateProduct(product)

        return res
            .status(response.statusCode)
            .send(response)
    } catch (error) {
        const newError = resError(error)

        return res
            .status(newError.statusCode)
            .send(newError)
    }
}

async function deleteProduct(req: Request, res: Response) {
    try {
        const { _id }: { _id: string } = req.body
    
        const response = await productService.deleteProduct(_id)

        return res
            .status(response.statusCode)
            .send(response)
    } catch (error) {
        const newError = resError(error)

        return res
            .status(newError.statusCode)
            .send(newError)
    }
}

async function getOne(req: Request, res: Response) {
    try {
        const { id }: any = req.params

        const response = await productService.getById(id)

        return res
            .status(response.statusCode)
            .send(response)

    } catch (error) {
        const errorRes = resError(error)

        return res
            .status(errorRes.statusCode)
            .send(errorRes)
    }
}

async function getByCategory(req: Request, res: Response) {
    try {
        const { id }: any = req.params

        const response = await productService.getByCategory(id)

        return res
            .status(response.statusCode)
            .send(response)

    } catch (error) {
        const errorRes = resError(error)

        return res
            .status(errorRes.statusCode)
            .send(errorRes)
    }
}
export default { getAll, create, updateProduct, deleteProduct, getOne, getByCategory }