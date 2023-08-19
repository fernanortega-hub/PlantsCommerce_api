import productModel from "../models/product.model"
import { IProduct } from "../types/types"

export const get = async (criteria: any) => await productModel.findOne(criteria).populate('categories', ['name', '_id']).populate('user', ['firstName', 'lastName', '_id', 'email'])
export const find = async (criteria: any) => await productModel.find(criteria).populate('categories', ['name', '_id']).populate('user', ['firstName', 'lastName', '_id', 'email'])
export const create = async (product: IProduct) => await (new productModel(product)).save()
export const update = async (criteria: any, product: IProduct) => await productModel.findOneAndUpdate(criteria, product, { new: true })
export const deleteProduct = async (productId: string) => await productModel.deleteOne({ _id: productId })
export const getAll = async (limit: number) => await productModel.find()
    .populate('categories', ['name', '_id']).populate('user', ['firstName', 'lastName', '_id', 'email']).limit(limit)