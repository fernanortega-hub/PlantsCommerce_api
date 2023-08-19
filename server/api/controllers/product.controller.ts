import { Request, Response } from "express";
import { IProduct, ResponseHandler } from "../types/types";
import productService from "../services/product.service";

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
        const product = req.body

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

export default { getAll, create, updateProduct, deleteProduct }