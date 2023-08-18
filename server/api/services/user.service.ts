import * as userRepository from "../repositories/user.repository"
import { IUser, ResponseHandler } from "../types/types"


async function getById(id: string): Promise<ResponseHandler<IUser | null>> {
    const foundedUser = await userRepository.get({ _id: id })

    const response: ResponseHandler<IUser | null> = {
        isSuccessful: false,
        statusCode: 404,
        status: "Not found",
        message: "User not found",
        data: null
    }

    if(foundedUser == null) 
        return response

    
    response.isSuccessful = true
    response.statusCode = 200
    response.status = "Success"
    response.message = "User founded"

    response.data = foundedUser

    return response
}

async function getByEmail(email: string): Promise<ResponseHandler<IUser | null>> {
    const foundedUser = await userRepository.get({ email: email })

    const response: ResponseHandler<IUser | null> = {
        isSuccessful: false,
        statusCode: 404,
        status: "Not found",
        message: "User not found",
        data: null
    }

    if(foundedUser == null) 
        return response

    
    response.isSuccessful = true
    response.statusCode = 200
    response.status = "Success"
    response.message = "User founded"

    response.data = foundedUser

    return response
}

async function getAll(limit: number): Promise<ResponseHandler<Array<IUser>>> {
    const users = await userRepository.getAll(limit);
    
    const response: ResponseHandler<Array<IUser>> = {
        isSuccessful: false,
        status: "Not found",
        statusCode: 404,
        data: [],
        message: "Not users"
    }

    response.isSuccessful = users.length !== 0
    response.data = users
    response.statusCode = users.length !== 0 ? 200 :  404
    response.message = users.length !== 0 ? "Users founded" : "Not users"
    response.status = users.length !== 0 ? "Founded" : "Not found"

    return response;
};

async function login(email: string, password: string): Promise<ResponseHandler<string | null>>  {
    const user = await userRepository.get({ email: email });
    const response: ResponseHandler<string | null> = {
        isSuccessful: false,
        data: null,
        statusCode: 404,
        message: "User not found",
        status: "Error"
    }

    if (!user) 
        return response

    const validPassword = await user.validPassword(password)

    if (!validPassword) {
        response.statusCode = 403
        response.message = "Invalid password"

        return response
    }

    response.data = user.generateJwt()
    response.isSuccessful = true
    response.statusCode = 200
    response.status = "Success"
    response.message = "token"

    return response
};

async function registerUser(user: IUser): Promise<ResponseHandler<IUser | null>> {
    const isNew = await userRepository.get({ email: user.email });
    const response: ResponseHandler<IUser | null> =  {
        isSuccessful: false,
        data: null,
        statusCode: 400,
        message: 'Bad request',
        status: 'Bad request'
    }

    if (isNew != null) {
        response.statusCode = 409
        response.status = 'ERROR'
        response.message = 'User already exists'

        return response; 
    }

    const newUser = await userRepository.create(user);

    response.data = newUser
    response.isSuccessful = true
    response.message = "User registered successfully"
    response.statusCode = 201
    response.status = "Created"

    return response;
}

async function updateUser(user: IUser): Promise<ResponseHandler<IUser | null>> {
    const response: ResponseHandler<IUser | null> = {
        isSuccessful: false,
        status: "Not found",
        statusCode: 404,
        message: "User not found",
        data: null,
    }

    const foundedUser = await userRepository.get({ _id: user.id!! })

    if(!foundedUser) 
        return response
    
    const newFields: IUser = {
        firstName: user.firstName || foundedUser.firstName,
        lastName: user.lastName || foundedUser.lastName,
        password: user.password || foundedUser.password,
        email: user.email || foundedUser.email,
        role: user.role || foundedUser.role,
        id: foundedUser.id
    }

    const updatedUser = await userRepository.update({ _id: newFields.id }, newFields)

    if(!updatedUser) {
        response.statusCode = 500
        response.status = "Update failed"
        response.message = "User cannot be updated"
        return response
    }

    response.data = updatedUser
    response.isSuccessful = true
    response.message = "User updated successfully"
    response.status = "Success"
    response.statusCode = 200

    return response
}


export default { getAll, getByEmail, getById, registerUser, login, updateUser };