import productModel from "../models/product.model"
import { IProduct } from "../types/types"

export const get = async(product: IProduct) => await productModel.findOne(product)
export const find = async(product: IProduct) => await productModel.find({ product })
export const create = async(product: IProduct) => await (new productModel(product)).save()
export const update = async(product: IProduct) => await productModel.findOne(product)
export const deleteProduct = async(productId: string) => await productModel.deleteOne({ _id: productId })
export const getAll = async(limit: number) => await productModel.find().limit(limit)