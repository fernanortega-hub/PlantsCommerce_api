
import categoryModel from "../models/category.model"
import { ICategory } from "../types/types"

export const get = async(category: ICategory) => await categoryModel.findOne(category)
export const find = async(category: ICategory) => await categoryModel.find(category)
export const create = async(category: ICategory) => await (new categoryModel(category)).save()
export const update = async(category: ICategory) => await categoryModel.findOne(category)
export const deletecategory = async(categoryId: string) => await categoryModel.deleteOne({ _id: categoryId })
export const getAll = async(limit: number) => await categoryModel.find().limit(limit)