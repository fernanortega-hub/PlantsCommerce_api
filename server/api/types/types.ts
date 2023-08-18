import { JwtPayload } from "jsonwebtoken"
import { Types, Model } from "mongoose"

export interface IUser  {
    _id?: string
    firstName: string
    lastName: string,
    email: string,
    password: string,
    role: string
}

export interface IUserMethods {
    validPassword(password: string): Promise<Boolean>,
    generateJwt(): string,
    generateRecoveryJwt(): string
    validRecoveryJwt(token: string): JwtPayload | string
    validateJwt(token: string): JwtPayload | string
}

export type UserModel = Model<IUser, {}, IUserMethods> 

export interface IProduct {
    id?: string,
    name?: string,
    stock?: number,
    imageUrl?: string | null,
    categories?: Array<Types.ObjectId>,
    description?: string,
    price?: number
} 

export interface ICategory {
    name: string
}

/**
 * Interfaz para enviar todo un tipo de respuesta general a traves de toda la api
 */
export type ResponseHandler<T> = {
    isSuccessful: Boolean,
    data: T | null,
    statusCode: number,
    status: string
    message: string | null
}