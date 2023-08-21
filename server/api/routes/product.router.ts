import { Router } from "express";
import productController from "../controllers/product.controller";
import validateForModifyProduct from "../middlewares/validateForModifyProduct";


export const productRouter = Router()
    .get("", productController.getAll)
    .get('/:id', productController.getOne)
    .get('/category/:id', productController.getByCategory)
    .post("/create", productController.create)
    .patch("/update", [validateForModifyProduct], productController.updateProduct)
    .delete("/delete", [validateForModifyProduct], productController.deleteProduct)