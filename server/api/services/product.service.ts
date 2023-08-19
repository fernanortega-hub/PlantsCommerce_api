import * as productRepository from "../repositories/product.repository"
import * as categoryRepository from "../repositories/category.repository"
import { ICategory, IProduct, IUser, ResponseHandler } from "../types/types"
import Category from "../models/category.model"
import { Types, ObjectId } from "mongoose"
import { get } from "../repositories/user.repository"


async function getById(_id: string): Promise<ResponseHandler<IProduct | null>> {
    const foundedProduct = await productRepository.get({ _id: _id })

    const response: ResponseHandler<IProduct | null> = {
        isSuccessful: false,
        statusCode: 404,
        status: "Not found",
        message: "Product not found",
        data: null
    }

    if (foundedProduct == null)
        return response


    response.isSuccessful = true
    response.statusCode = 200
    response.status = "Success"
    response.message = "Product founded"

    response.data = foundedProduct

    return response
}

async function getByCategory(categoryId: string): Promise<ResponseHandler<IProduct[]>> {
    const products = await productRepository.find({ categories: categoryId })


    const response: ResponseHandler<IProduct[]> = {
        isSuccessful: false,
        statusCode: 404,
        status: "Not found",
        message: "Not products founded by this category",
        data: []
    }



    response.isSuccessful = products.length !== 0
    response.data = products
    response.statusCode = products.length !== 0 ? 200 : 404
    response.message = products.length !== 0 ? "Products founded" : "Not products founded by this category"
    response.status = products.length !== 0 ? "Founded" : "Not found"

    return response
}

async function getAll(limit: number): Promise<ResponseHandler<IProduct[]>> {
    const products = await productRepository.getAll(limit);

    const response: ResponseHandler<IProduct[]> = {
        isSuccessful: false,
        status: "Not found",
        statusCode: 404,
        data: [],
        message: "Not products"
    }

    response.isSuccessful = products.length !== 0
    response.data = products
    response.statusCode = products.length !== 0 ? 200 : 404
    response.message = products.length !== 0 ? "Users founded" : "Not users"
    response.status = products.length !== 0 ? "Founded" : "Not found"

    return response;
};

async function createProduct(product: IProduct): Promise<ResponseHandler<IProduct | null>> {
    const response: ResponseHandler<IProduct | null> = {
        isSuccessful: false,
        data: null,
        statusCode: 400,
        message: 'Bad request',
        status: 'Bad request'
    }

    const existingUser = await get({ _id: product.user._id })

    if(!existingUser) {
        response.message = "User not found"
        response.statusCode = 404
        response.status = "Not found"
        return response
    }

    if(product.categories.length <= 0) {
        response.message = "At least one category is required"
        response.status = "Bad request"
        response.statusCode = 400
        return response
    }

    const allCategories = await categoryRepository.getAll()

    const categoryIds: Types.ObjectId[] = []

    const mapped: Array<ICategory> = product.categories.map((category) => {
        return JSON.parse(JSON.stringify(category))
    })

    mapped.forEach(async (category) => {
        let newCategory = allCategories.find((cat) => cat.name.toLowerCase() === category.name.toLowerCase())

        if(!newCategory) {
            newCategory = new Category({ name: category.name })
            await newCategory.save()
        }
        
        categoryIds.push(newCategory.id)
    })

    const newProduct: IProduct = {
        ...product,
        categories: categoryIds
    }

    const res = await productRepository.create(newProduct);

    response.data = res
    response.isSuccessful = true
    response.message = "Product created successfully"
    response.statusCode = 201
    response.status = "Created"

    return response;
};

async function updateProduct(product: IProduct): Promise<ResponseHandler<ICategory | null>> {
    const response: ResponseHandler<IProduct | null> = {
        isSuccessful: false,
        data: null,
        statusCode: 404,
        message: 'Product not found',
        status: 'Not found'
    }

    const existingUser = await get({ _id: product.user._id })

    if(!existingUser) {
        response.message = "User not found for update product"
        response.statusCode = 404
        response.status = "Not found"
        return response
    }

    const existingProduct = await productRepository.get({ _id: product._id });


    if (existingProduct === null) 
        return response

    const categoryIds: Types.ObjectId[] = []

    if(product.categories.length <= 0) {
        response.message = "At least one category is required"
        response.status = "Bad request"
        response.statusCode = 400
        return response
    }
        

    if(product.categories !== existingProduct.categories) {
        const allCategories = await categoryRepository.getAll()

        const mapped: Array<ICategory> = product.categories.map((category) => {
            return JSON.parse(JSON.stringify(category))
        })
    
        mapped.forEach(async (category) => {
            let newCategory = allCategories.find((cat) => cat.name.toLowerCase() === category.name.toLowerCase())
    
            if(!newCategory) {
                newCategory = new Category({ name: category.name })
                await newCategory.save()
            }
            
            categoryIds.push(newCategory.get('_id'))
        })
    }
    
    const dataToSave: IProduct = {
        _id: existingProduct._id,
        name: product.name || existingProduct.name,
        stock: product.stock || existingProduct.stock,
        imageUrl: product.imageUrl || existingProduct.imageUrl,
        price: product.price || existingProduct.price,
        categories: categoryIds,
        description: product.description || existingProduct.description,
        user: existingUser.get('_id')
    }

    const updatedProduct = await productRepository.update({ _id: dataToSave._id }, dataToSave);

    if(!updatedProduct) {
        response.statusCode = 500
        response.message = "Cannot update this product, try later"
        response.status = "Internal error"
        return response
    }


    response.data = updatedProduct
    response.isSuccessful = true
    response.message = "Product updated successfully"
    response.statusCode = 200
    response.status = "Success"

    return response;
}

async function deleteProduct(id: string): Promise<ResponseHandler<Boolean | null>> {
    const response: ResponseHandler<Boolean> = {
        isSuccessful: false,
        message: "Product not found",
        statusCode: 404,
        status: "Not found",
        data: null,
    }

    const foundedProduct = await productRepository.get({ _id: id })

    if (!foundedProduct) {
        return response
    }

    const userDeleted = await productRepository.deleteProduct(id)

    if (!userDeleted) {
        response.message = "Cannot delete product"
        response.status = "Service error"
        response.statusCode = 500
        response.data = false
        return response
    }

    response.isSuccessful = true
    response.data = true
    response.status = "Deleted"
    response.message = "Product deleted successfully"
    response.statusCode = 202

    return response
}


export default { getAll, getByCategory, getById, createProduct, updateProduct, deleteProduct };