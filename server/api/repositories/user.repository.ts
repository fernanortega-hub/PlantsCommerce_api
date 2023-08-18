import userModel from "../models/user.model"; 
import { IUser } from "../types/types";

export const get = async(criteria: any) => await userModel.findOne(criteria)
export const find = async(user: IUser) => await userModel.find({ user })
export const create = async(user: IUser) => await (new userModel(user)).save()
export const update = async(criteria: any, user: IUser) => await userModel.findOneAndUpdate(criteria, user, { new: true })
export const deleteUser = async(id: string) => await userModel.deleteOne({ _id: id })
export const getAll = async(limit: number) => await userModel.find().limit(limit)